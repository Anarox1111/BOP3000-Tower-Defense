import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  deleteUser
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { auth } from "./firebase-config.js";

// Initialize Firestore
const db = getFirestore();

export const registerUser = async (email, username, password, nationality) => {
  try {
    // First create the user with email and password in Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    try {
      // Now that we're authenticated, check if username already exists
      const usersRef = collection(db, "users");
      const usernameQuery = query(usersRef, where("username", "==", username));
      const usernameSnapshot = await getDocs(usernameQuery);
      
      if (!usernameSnapshot.empty) {
        // If username exists, delete the auth user and return error
        await deleteUser(userCredential.user);
        return { success: false, error: "Username already exists" };
      }

      // Prepare user data for Firestore (never store passwords in Firestore!)
      const userData = {
        username: username,
        email: email,
        uid: userCredential.user.uid,
        nationality: nationality,
        dateCreated: new Date(),
        stats: {
          totalTowerDamage: 0,
          totalResourcesGathered: 0,
          totalEnemiesKilled: 0,
          totalMoneySpent: 0,
          highestWaveReached: 0,
          totalBossStagesReached: 0
        }
      };

      // Add user to Firestore using their auth UID as the document ID
      await setDoc(doc(db, "users", userCredential.user.uid), userData);

      console.log(`User registered successfully! Email: ${email}, Username: ${username}, Nationality: ${nationality}`);
      return { success: true, user: userCredential.user };
    } catch (error) {
      // If anything fails after auth creation, clean up by deleting the auth user
      await deleteUser(userCredential.user);
      throw error;
    }
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: error.message };
  }
};

export const loginUser = async (emailOrUsername, password) => {
  try {
    let email = emailOrUsername;
    
    // If input doesn't look like an email, try to find the email by username
    if (!emailOrUsername.includes('@')) {
      const usersRef = collection(db, "users");
      const usernameQuery = query(usersRef, where("username", "==", emailOrUsername));
      const querySnapshot = await getDocs(usernameQuery);
      
      if (querySnapshot.empty) {
        return { success: false, error: "Username not found" };
      }
      
      email = querySnapshot.docs[0].data().email;
    }

    // Sign in with email and password
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Get additional user data from Firestore
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
    const userData = userDoc.data();

    return { 
      success: true, 
      user: userCredential.user,
      userData: userData // Include the Firestore user data in the response
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: error.message };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: error.message };
  }
};

export const getUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    } else {
      return { success: false, error: "User data not found" };
    }
  } catch (error) {
    console.error("Get user data error:", error);
    return { success: false, error: error.message };
  }
};

export const updateUserStats = async (uid, stats) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (!userDoc.exists()) {
      return { success: false, error: "User not found" };
    }

    const currentStats = userDoc.data().stats || {
      totalTowerDamage: 0,
      totalResourcesGathered: 0,
      totalEnemiesKilled: 0,
      totalMoneySpent: 0,
      highestWaveReached: 0,
      totalBossStagesReached: 0
    };

    // Update stats with new values if they are higher
    const newStats = {
      totalTowerDamage: Math.max(currentStats.totalTowerDamage, stats.totalTowerDamage || 0),
      totalResourcesGathered: Math.max(currentStats.totalResourcesGathered, stats.totalResourcesGathered || 0),
      totalEnemiesKilled: Math.max(currentStats.totalEnemiesKilled, stats.totalEnemiesKilled || 0),
      totalMoneySpent: Math.max(currentStats.totalMoneySpent, stats.totalMoneySpent || 0),
      highestWaveReached: Math.max(currentStats.highestWaveReached, stats.highestWaveReached || 0),
      totalBossStagesReached: Math.max(currentStats.totalBossStagesReached, stats.totalBossStagesReached || 0)
    };

    await updateDoc(doc(db, "users", uid), { stats: newStats });
    return { success: true, data: newStats };
  } catch (error) {
    console.error("Update user stats error:", error);
    return { success: false, error: error.message };
  }
}; 