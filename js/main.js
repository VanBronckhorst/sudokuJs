let viz = document.getElementById("viz");

let UIObj = createGrid(viz);
let UICells = UIObj.cells;
let UIBoard = UIObj.board;
let state = createDataObjects();

console.log(state);

for (const [key, value] of Object.entries(UICells)) {
    value.addEventListener('pointerover', () => onCellHover(key));
}
UIBoard.addEventListener('pointerout', () => onCellHover("out"));

function onCellHover(cell) {
    console.log("Hovering", cell);
    let cellPeers = state.peers[cell] || [];
    for (const [key, value] of Object.entries(UICells)) {
        if (cellPeers.includes(key)) {
            value.classList.add("focus-cell");
        } else {
            value.classList.remove("focus-cell");
        }
    }
}