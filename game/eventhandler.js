import { Tower, towers } from "../entities/towers/tower.js";
import { createTower } from "../entities/towers/towerFactory.js";
import { canvas, money, price, updateMoney, updateResources, updateTowerStats } from "./game.js";
import { cellSize } from "./grid.js";
import { getChosenTower } from "../entities/towers/towerState.js";



export const mouse = {
    x: 10,
    y: 10,
    width: 0.1,
    height: 0.1,
}

/**
 * handleCanvasClick-event
 *               

 * @description Event that listens to clicks on the gameCanvas. 
 * Author:    Anarox
 * Created:   23.01.2025
 **/
export function handleCanvasClick() {
    // The closest grid cellvalue to where the mouse is.
    const gridMousePosX = mouse.x - (mouse.x % cellSize);
    const gridMousePosY = mouse.y - (mouse.y % cellSize);

    // Stops user from being able to place turrets on topBar.
    if (gridMousePosY < cellSize) {
        return;
    }

    /**
     * Handles tower selection and ensures that the right tower is selected.
     *               

     * Author:    Anarox
     * Editor: Quetzalcoatl
     * Created:   27.02.2025
     **/
    if (towers) {
        const selectedTower = towers.find(tower => tower.selected);
        if (selectedTower) selectedTower.selected = false;
    }

    for (let tower of towers) {
        if (tower.x === gridMousePosX && tower.y === gridMousePosY) {
            tower.selected = true;
            break;
        }
    }

    if (money >= price && !towers.some(tower => tower.selected)) {
        var type = getChosenTower();
        const tower = createTower(gridMousePosX, gridMousePosY, type);
        towers.push(tower);
        tower.selected = true;
        updateMoney("decrease", price);
        updateResources("increase", 10);
    }
    
    if (towers) {
        const selectedTower = towers.find(tower => tower.selected);
        updateTowerStats(selectedTower);
    }
}


/**
 * Remove contextmenu
 *               

 * @description Event that removes contextmenu/right-click and solves a game bug.
 * Author:    Anarox
 * Created:   17.03.2025
 **/
canvas.addEventListener("contextmenu", e => e.preventDefault())



/**
 * MouseMouse event
 *               

 * @description Event that listens to where the mouse is on the screen. 
 * Author:    Anarox
 * Created:   27.02.2025
 **/
export function mouseMove(event) {
    let canvasPosition = canvas.getBoundingClientRect();

    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
}

export function mouseLeave(event) {
    mouse.x = undefined;
    mouse.y = undefined;
}

export function gridRectColission(first, second) {
    if (    !(  first.x > second.x + second.width ||
                first.x + first.width < second.x ||
                first.y > second.y + second.height ||
                first.y + first.height < second.y )
    ) {
        return true;
    }
}


function openTab(btn) {
    // Fjern 'selected' fra alle knapper
    document.querySelectorAll('.tabs>.selected').forEach(tab => {
        tab.classList.remove('selected');
    });
    btn.classList.add('selected');

    // Lukk alle faner før åpning av ny
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('open');
    });

    // Åpne valgt fane
    const tabName = btn.getAttribute('data-tab');
    document.querySelector(`.tab.${tabName}`).classList.add('open');
}



window.upgradeTower = () => {
    const tower = towers.find(tower => tower.selected);
    console.log("H" + towers.length)
    
    if (tower) {

        tower.oldStats = { 
            ...tower.newStats
        };


        tower.upgrade();
        updateTowerStats(tower);
    }
}

window.openTab = openTab;


const keybindings = {
    gameTab: 'q',
    towerTab: 'w',
    inventoryTab: 'e',
    shopTab: 'r'
};

// Function to save keybindings to localStorage
function saveKeybindings() {
    localStorage.setItem('keybindings', JSON.stringify(keybindings));
}

// Function to load keybindings from localStorage
function loadKeybindings() {
    const saved = localStorage.getItem('keybindings');
    if (saved) {
        Object.assign(keybindings, JSON.parse(saved));
    }
    updateKeybindingInputs();
}

// Function to update the keybinding input fields
function updateKeybindingInputs() {
    document.getElementById('gameTabKey').value = keybindings.gameTab;
    document.getElementById('towerTabKey').value = keybindings.towerTab;
    document.getElementById('inventoryTabKey').value = keybindings.inventoryTab;
    document.getElementById('shopTabKey').value = keybindings.shopTab;
}

// Function to handle keybinding setup
function setupKeybinding(inputId, bindingKey) {
    const input = document.getElementById(inputId);
    input.addEventListener('click', () => {
        input.value = 'Press a key...';
        const handleKeyPress = (e) => {
            const key = e.key.toLowerCase();
            if (key.match(/^[a-z]$/)) {
                keybindings[bindingKey] = key;
                input.value = key;
                saveKeybindings();
                document.removeEventListener('keydown', handleKeyPress);
            }
        };
        document.addEventListener('keydown', handleKeyPress);
    });
}

// Initialize keybinding setup
function initializeKeybindings() {
    loadKeybindings();
    setupKeybinding('gameTabKey', 'gameTab');
    setupKeybinding('towerTabKey', 'towerTab');
    setupKeybinding('inventoryTabKey', 'inventoryTab');
    setupKeybinding('shopTabKey', 'shopTab');
}

// Handle keyboard shortcuts for tab switching
document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    switch (key) {
        case keybindings.gameTab:
            document.querySelector('[data-tab="game-tab"]').click();
            break;
        case keybindings.towerTab:
            document.querySelector('[data-tab="tower-tab"]').click();
            break;
        case keybindings.inventoryTab:
            document.querySelector('[data-tab="inventory-tab"]').click();
            break;
        case keybindings.shopTab:
            document.querySelector('[data-tab="shop-tab"]').click();
            break;
    }
});

// Initialize keybindings when the page loads
window.addEventListener('load', initializeKeybindings);


