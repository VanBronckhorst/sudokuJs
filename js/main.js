const viz = document.getElementById("viz");

const UIObj = createGrid(viz);
const UICells = UIObj.cells;
const UIBoard = UIObj.board;
const CONSTANTS = createDataObjects();
setupUIListenerers();

const grid1 = '003020600900305001001806400008102900700000008006708200002609500800203009005010300';
const grid2 = '4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......'
const boardState = solveGrid(grid2);
drawSolution(boardState);

function drawSolution(solution) {
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
    }
    UIBoard.addEventListener('pointerout', () => onCellHover("out"));
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