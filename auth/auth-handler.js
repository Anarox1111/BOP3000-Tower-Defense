import { loginUser, registerUser } from './auth-service.js';

// Common validation function
const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,20}$/;
    return passwordRegex.test(password);
};

// Login page handler
export const initLoginPage = () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const loginButton = document.getElementById('loginButton');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    function validateInputs() {
        const email = emailInput.value;
        const password = passwordInput.value;
        
        if (email && password && validatePassword(password)) {
            loginButton.classList.add('active', 'upgrade');
        } else {
            loginButton.classList.remove('active', 'upgrade');
        }
    }

    emailInput.addEventListener('input', validateInputs);
    passwordInput.addEventListener('input', validateInputs);

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;

        if (!validatePassword(password)) {
            errorMessage.textContent = 'Password must be 8-20 characters long and contain at least one uppercase letter, one lowercase letter, and one number';
            errorMessage.style.display = 'block';
            return;
        }

        const result = await loginUser(email, password);
        if (result.success) {
            console.log('Login successful');
            window.location.href = '/index.html';
        } else {
            errorMessage.textContent = result.error;
            console.log('Login failed');
            errorMessage.style.display = 'block';
        }
    });
};

// Register page handler
export const initRegisterPage = () => {
    const registerForm = document.getElementById('registerForm');
    const errorMessage = document.getElementById('errorMessage');
    const registerButton = document.getElementById('registerButton');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    function validateInputs() {
        const email = emailInput.value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (email && password && confirmPassword && 
            validatePassword(password) && 
            password === confirmPassword) {
            registerButton.classList.add('active-register', 'upgrade');
        } else {
            registerButton.classList.remove('active-register', 'upgrade');
        }
    }

    emailInput.addEventListener('input', validateInputs);
    passwordInput.addEventListener('input', validateInputs);
    confirmPasswordInput.addEventListener('input', validateInputs);

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (!validatePassword(password)) {
            errorMessage.textContent = 'Password must be 8-20 characters long and contain at least one uppercase letter, one lowercase letter, and one number';
            errorMessage.style.display = 'block';
            return;
        }

        if (password !== confirmPassword) {
            errorMessage.textContent = 'Passwords do not match';
            errorMessage.style.display = 'block';
            return;
        }

        const result = await registerUser(email, password);
        if (result.success) {
            window.location.href = '/index.html';
        } else {
            errorMessage.textContent = result.error;
            errorMessage.style.display = 'block';
        }
    });
}; 