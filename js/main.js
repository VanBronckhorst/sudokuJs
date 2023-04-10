const viz = document.getElementById("viz");

const UIObj = createGrid(viz);
const UICells = UIObj.cells;
const UIBoard = UIObj.board;
const CONSTANTS = createDataObjects();

const keyboardModeToggle = document.getElementById("keyboard-switch");

const undoButton = document.getElementById("undo-button");
const hintButton = document.getElementById("hint-button");
const randomButton = document.getElementById("random-button");

const radialMenu = document.getElementById('radial-menu');
const menuItems = radialMenu.querySelectorAll('.menu-item');

let statesHistory = [];
let hintMode = false;
let activeCell = null;

setupUIListenerers();


const grid1 = '003020600900305001001806400008102900700000008006708200002609500800203009005010300';
const grid2 = '4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......'

statesHistory.push(grid1);
drawGrid(grid1);

function drawGrid(gridString) {
    for (const [_, cell] of Object.entries(UICells)) {
        resetCell(cell, keyboardModeToggle.checked);
    }

    const parsed = gridValues(gridString);
    for (const [key, val] of Object.entries(parsed)) {
        if ("123456789".includes(val)) {
            setValue(UICells[key], val);
        }
    }

    if (hintMode) {
        const naiveSolution = parseGrid(gridString);
        for (const [key, val] of Object.entries(naiveSolution)) {
            // Ignore already set cells.
            if ("123456789".includes(parsed[key])) {
                continue;
            }

            if (val.length > 1) {
                setHints(UICells[key], val);
            } else if ("123456789".includes(val)) {
                setHints(UICells[key], val);
            }
        }
    }

    const conflicts = detectConflicts(gridString);
    if (conflicts !== false) {
        conflicts.forEach((key) => {
            setConflict(UICells[key]);
        });
    }
}


function setupUIListenerers() {
    for (const [key, value] of Object.entries(UICells)) {
        value.addEventListener('pointerover', () => onCellHover(key));
        value.pll_input.addEventListener('input', () => onInput(key, value));

        value.addEventListener('click', (event) => {
            if (event.target.readOnly || keyboardModeToggle.checked) {
                return;
            }

            // Display the radial menu off-screen to force the browser to calculate its dimensions
            radialMenu.style.left = '-9999px';
            radialMenu.style.display = 'block';
            
            activeCell = event.target;
            const cellRect = activeCell.getBoundingClientRect();

            radialMenu.style.left = `${cellRect.left + window.scrollX - radialMenu.clientWidth / 2 + activeCell.clientWidth / 2}px`;
            radialMenu.style.top = `${cellRect.top + window.scrollY - radialMenu.clientHeight / 2 + activeCell.clientHeight / 2}px`;
            radialMenu.style.display = 'block';
        });
    }
    UIBoard.addEventListener('pointerout', () => onCellHover("out"));


    keyboardModeToggle.addEventListener('change', function () {
        if (keyboardModeToggle.checked) {
            setKeyboardMode(true);
        } else {
            setKeyboardMode(false);
        }
    });

    undoButton.addEventListener('click', function () {
        undoLastMove()
    });

    hintButton.addEventListener('click', () => hintClicked());
    randomButton.addEventListener('click', () => randomClicked());

    // Attach event listeners to radial menu items
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            if (activeCell) {
                activeCell.pll_input.value = item.dataset.value;
                activeCell.pll_input.dispatchEvent(new Event('input')); // Trigger input event for validation
            }

            // Hide radial menu
            radialMenu.style.display = 'none';
            activeCell = null;
        });
    });

    // Hide the radial menu when clicking outside of it
    document.addEventListener('click', (event) => {
        if (!radialMenu.contains(event.target) && !activeCell?.contains(event.target)) {
            radialMenu.style.display = 'none';
        }
    });
}

function undoLastMove() {
    if (statesHistory.length > 1) {
        statesHistory.pop();
        drawGrid(statesHistory[statesHistory.length - 1]);
    }
}

function hintClicked() {
    hintMode = !hintMode;
    drawGrid(statesHistory[statesHistory.length - 1]);
}

function randomClicked() {
    let puzzle = generatePuzzle(30);
    statesHistory = [puzzle];
    drawGrid(puzzle);
}

function onCellHover(cell) {
    const cellPeers = CONSTANTS.peers[cell] || [];
    for (const [key, value] of Object.entries(UICells)) {
        if (cellPeers.includes(key)) {
            value.classList.add("focus-cell");
        } else {
            value.classList.remove("focus-cell");
        }
    }
}

function onInput(key, cell) {
    let userInput = cell.pll_input.value;

    if (userInput.length > 1) {
        cell.pll_input.value = userInput[0];
    }

    if (!"123456789".includes(userInput)) {
        cell.pll_input.value = "";
    }

    if ("123456789".includes(userInput)) {
        let newGrid = gridStringFromCells(UICells);
        statesHistory.push(newGrid);
        drawGrid(newGrid);
    }
}

function setKeyboardMode(inputStyleKeyboard) {
    for (const [_, cell] of Object.entries(UICells)) {
        updateInputStyle(cell, inputStyleKeyboard);
    }
}


