const viz = document.getElementById("viz");

const UIObj = createGrid(viz);
const UICells = UIObj.cells;
const UIBoard = UIObj.board;
const CONSTANTS = createDataObjects();

const keyboardModeToggle = document.getElementById("keyboard-switch");

let statesHistory = [];

setupUIListenerers();


const grid1 = '003020600900305001001806400008102900700000008006708200002609500800203009005010300';
const grid2 = '4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......'

statesHistory.push(grid2);
drawGrid(grid2);

function drawGrid(gridString) {
    const solution = gridValues(gridString);
    const naiveSolution = parseGrid(gridString);
    for (const [key, val] of Object.entries(solution)) {
        if (val.length > 1) {
            setHints(UICells[key], val);
        } else if ("123456789".includes(val)) {
            setValue(UICells[key], val);
        }
    }
}


function setupUIListenerers() {
    for (const [key, value] of Object.entries(UICells)) {
        value.addEventListener('pointerover', () => onCellHover(key));
        value.pll_input.addEventListener('input', () => onInput(key, value));
    }
    UIBoard.addEventListener('pointerout', () => onCellHover("out"));


    keyboardModeToggle.addEventListener('change', function () {
        if (keyboardModeToggle.checked) {
            setKeyboardMode(true);
        } else {
            setKeyboardMode(false);
        }
    });

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