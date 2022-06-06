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

function gridStringFromCells(boardObj) {
    let res = "";
    for (let r of "ABCDEFGHI") {
        for (let c of "123456789") {
            let cell = boardObj[r+c];
            if (cell.pll_value.textContent) {
                res += cell.pll_value.textContent;
            } else if (cell.pll_input.value.length > 0){
                res += cell.pll_input.value;
            } else {
                res += ".";
            }
        }
    }

    return res;
}


function createCell() {
    let cell = document.createElement("div");
    cell.classList.add("cell");
    let hints = document.createElement("div");
    let value = document.createElement("div");
    let input = document.createElement("input");
    //input.type = "number";

    value.classList.add("cell-value");
    value.classList.add("invisible");
    hints.classList.add("cell-hints");
    hints.classList.add("invisible");
    input.classList.add("cell-input");
    input.classList.add("invisible");

    let val = document.createElement("span");
    val.classList.add("span-value");
    value.appendChild(val);

    cell.appendChild(hints);
    cell.appendChild(value);
    cell.appendChild(input);
    cell.pll_value = value;
    cell.pll_input = input;
    cell.pll_val_span = val;
    return cell;
}

function setValue(cell, value) {
    let valueContainer = cell.querySelector(".cell-value");
    let hintContainer = cell.querySelector(".cell-hints");
    let inputContainer = cell.querySelector(".cell-input");
    hintContainer.classList.add("invisible");
    inputContainer.classList.add("invisible");
    valueContainer.classList.remove("invisible");

    cell.pll_val_span.textContent = value;
}

function updateInputStyle(cell, inputStyleKeyboard) {
    let valueContainer = cell.querySelector(".cell-value");
    let inputContainer = cell.querySelector(".cell-input");
    if (valueContainer.textContent.length === 0) {
        if (inputStyleKeyboard) {
            inputContainer.classList.remove("invisible");
        } else {
            inputContainer.classList.add("invisible");
        }
    } else {
        inputContainer.classList.add("invisible");
    }
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