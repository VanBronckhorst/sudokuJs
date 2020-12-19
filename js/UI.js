function createGrid(el) {
    let board = document.createElement("div");
    board.classList.add("board");
    let boardObj = {};

    for (let r of "ABCDEFGHI") {
        let row = document.createElement("div");
        for (let c of "123456789") {
            let cell = createCell();
            cell.classList.add((r.charCodeAt()+c.charCodeAt())%2==0 ? "white-cell" : "grey-cell");

            if ("369".includes(c)) {
                cell.classList.add("wall-right");
            }
            if ("147".includes(c)) {
                cell.classList.add("wall-left");
            }
            if ("CFI".includes(r)) {
                cell.classList.add("wall-bottom");
            }
            if ("ADG".includes(r)) {
                cell.classList.add("wall-top");
            }

            row.appendChild(cell);
            boardObj[r+c] = cell;
        }
        board.appendChild(row);
    }

    el.appendChild(board);
    return {
        board: board,
        cells: boardObj
    };
}


function createCell() {
    let cell = document.createElement("div");
    cell.style = "width:49px; height:49px";
    cell.classList.add("cell");
    let hints = document.createElement("div");
    let value = document.createElement("div");

    value.classList.add("cell-value");
    hints.classList.add("cell-hints");
    hints.classList.add("invisible");

    cell.appendChild(hints);
    cell.appendChild(value);
    return cell;
}

function setValue(cell, value) {
    let valueContainer = cell.querySelector(".cell-value");
    let hintContainer = cell.querySelector(".cell-hints");
    hintContainer.classList.add("invisible");
    valueContainer.classList.remove("invisible");

    let val = document.createElement("span");
    val.classList.add("span-value");
    val.textContent = value;
    valueContainer.appendChild(val);
}

function setHints(cell, hints) {
    let valueContainer = cell.querySelector(".cell-value");
    let hintContainer = cell.querySelector(".cell-hints");
    hintContainer.classList.remove("invisible");
    valueContainer.classList.add("invisible");

    for (value of hints) {
        let val = document.createElement("span");
        val.classList.add("span-hint");
        val.textContent = value;
        val.style = "row-start: " + Math.floor(+value / 3) + ";column-start: " + (+value % 3) + ";";
        hintContainer.appendChild(val);
    }  
}