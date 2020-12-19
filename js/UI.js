function createGrid(el) {
    let board = document.createElement("div");
    board.classList.add("board");
    let boardObj = {};

    for (let r of "ABCDEFGHI") {
        let row = document.createElement("div");
        for (let c of "123456789") {
            let cell = document.createElement("div");
            cell.style = "width:49px; height:49px";
            cell.classList.add("cell");
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