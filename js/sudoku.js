function createDataObjects() {
    let allCells = "ABCDEFGHI"
        .split("")
        .map((r) => "123456789".split("").map((c) => r + c))
        .flat();
    let rows = "ABCDEFGHI"
        .split("")
        .map((r) => allCells.filter((cell) => cell.includes(r)));
    let columns = "123456789"
        .split("")
        .map((r) => allCells.filter((cell) => cell.includes(r)));
    let squares = ["ABC", "DEF", "GHI"].flatMap((ur) =>
        ["123", "456", "789"].map((uc) => permutate(ur, uc))
    );
    unitsList = rows.concat(columns).concat(squares);
    let units = {};
    allCells.forEach((cell) => {
        units[cell] = unitsList.filter((u) => u.includes(cell));
    });

    let peers = {};
    allCells.forEach((cell) => {
        peersObj = {};
        units[cell].forEach((u) => u.forEach((peer) => (peersObj[peer] = 1)));
        delete peersObj[cell];
        peers[cell] = Object.keys(peersObj);
    });

    return {
        allCells,
        unitsList,
        units,
        peers,
    };
}
let K_SUDOKU = createDataObjects();

function permutate(s1, s2) {
    let res = [];
    for (c1 of s1) {
        for (c2 of s2) {
            res.push(c1 + c2);
        }
    }
    return res;
}

function solveGrid(gridStr) {
    return searchSolution(parseGrid(gridStr));
}

function searchSolution(solution) {
    // impossible puzzle?
    console.log("Searching solution:", solution);
    if (solution == false) {
        return false;
    }

    // is it already solved?
    if (_isSolved(solution)) {
        return solution;
    }


    let minVal = Infinity;
    let minCell = "";
    // find the not assinged cell with least possible values.
    for (const cell of K_SUDOKU.allCells) {
        const numSols = solution[cell].length;
        if (numSols > 1 && numSols < minVal) {
            minVal = numSols;
            minCell = cell;
        }
    }

    // Now try assigning all possible values to that cell, and recurse.
    for (const possibleVal of solution[minCell]) {
        let newSolution = structuredClone(solution);
        newSolution = assignValue(newSolution, minCell, possibleVal);

        console.log("Trying assignment: ", minCell, possibleVal, newSolution);

        newSolution = searchSolution(newSolution);
        if (newSolution !== false) {
            return newSolution;
        }
    }

    // All assignments failed, impossible puzzle. 
    return false;
}

function parseGrid(gridStr) {
    const gridVals = gridValues(gridStr);
    let solution = {};
    K_SUDOKU.allCells.forEach((c) => (solution[c] = "123456789"));

    for (const [key, val] of Object.entries(gridVals)) {
        console.log("assigning,",key,val," | Sol: ",solution);
        // The parsed grid contains 0 or ., ignore those.
        if ("123456789".includes(val) && !assignValue(solution, key, val)) {
            return false;
        }
    }

    return solution;
}

function assignValue(solution, key, val) {
    // To leave val as the only solution for key, we eliminate all other values one by one (propagating)
    const other_values = solution[key].replace(val, "");
    for (other of other_values) {
        let success = eliminate(solution, key, other);
        if (!success) {
            return false;
        }
    }
    return solution;
}

function eliminate(solution, key, val) {
    if (!solution[key].includes(val)) {
        // Already eliminated.
        return solution;
    }

    // Actually eliminate
    solution[key] = solution[key].replace(val, "");

    // If no solution left, fail
    if (solution[key].length == 0) {
        return false;
    }

    // If a single solution for key, we can eliminate it from all peers.
    if (solution[key].length == 1) {
        const sol = solution[key];
        let success = true;
        K_SUDOKU.peers[key].forEach((peer) => {
            if (!eliminate(solution, peer, sol)) {
                success = false;
            }
        });
        if (!success) {
            return false;
        }
    }

    // If a unit is left with only one place containing the eliminated value, assign it there.
    for (u of K_SUDOKU.unitsList) {
        const possible_spots = u.filter(cell => solution[cell].includes(val));

        if (possible_spots.length == 0) {
            // Fail, there is no place left in this unit to place the eliminated value
            return false;
        }

        if (possible_spots.length == 1) {
            const success = assignValue(solution, possible_spots[0], val);
            if (!success) {
                return false;
            }
        }
    }

    return solution;
}

function gridValues(gridStr) {
    let i = 0;
    let gridValues = {};
    for (c of gridStr) {
        if ("1234567890.".includes(c)) {
            gridValues[K_SUDOKU.allCells[i]] = c;
            i++;
        }
    }

    if (i == 81) {
        // Yay, parsed correctly.
        return gridValues;
    }

    console.error("Bad GridValue");
    return null;
}

function _isSolved(parsedGrid) {
    for (const cell of K_SUDOKU.allCells) {
        if (parsedGrid[cell].length !== 1) {
            return false;
        }
    }

    

    return true;
}

function detectConflicts(gridStr) {
    let parsed = gridValues(gridStr);
    let res = {};

    for (const [key, val] of Object.entries(parsed)) {
        if ("123456789".includes(val)) {
            K_SUDOKU.peers[key].forEach((peer) => {
                if (parsed[peer] === val) {
                    res[peer] = 1;
                    res[key] = 1;
                }
            });
        }
    }

    res = Object.keys(res);
    if (res.length > 0) {
        return res;
    }

    return false;
}


// Puzzle generation

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function isValid(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
        const r = Math.floor(row / 3) * 3 + Math.floor(i / 3);
        const c = Math.floor(col / 3) * 3 + i % 3;
        if (board[row][i] === num || board[i][col] === num || board[r][c] === num) {
            return false;
        }
    }
    return true;
}

function fillBoard(board, row = 0, col = 0) {
    // console.log(board,row,col);
    if (row === 9) {
        return true;
    }

    if (col === 9) {
        return fillBoard(board, row + 1, 0);
    }

    if (board[row][col] !== 0) {
        return fillBoard(board, row, col + 1);
    }

    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffleArray(nums);

    for (const num of nums) {
        if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (fillBoard(board, row, col + 1)) {
                return true;
            }
        }
    }

    board[row][col] = 0;
    return false;
}

function removeCells(board, count) {
    while (count > 0) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);

        if (board[row][col] !== 0) {
            const temp = board[row][col];
            board[row][col] = 0;

            const numSolutions = countSolutions(structuredClone(board), 0, 0, true);
            if (numSolutions === 1) {
                count--;
            } else {
                board[row][col] = temp;
            }
        }
    }
}

function countSolutions(board, row = 0, col = 0) {
    // console.log(board,row,col);

    if (row === 9) {
        return 1;
    }

    if (col === 9) {
        return countSolutions(board, row + 1, 0);
    }

    if (board[row][col] !== 0) {
        return countSolutions(board, row, col + 1);
    }

    let solutions = 0;
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffleArray(nums);

    for (const num of nums) {
        if (isValid(board, row, col, num)) {
            board[row][col] = num;
            solutions += countSolutions(board, row, col + 1);
            if (solutions > 1) {
                break;
            }
        }
    }

    board[row][col] = 0;
    return solutions;
}

function generatePuzzle(numClues = 30) {
    const board = Array.from({ length: 9 }, () => Array(9).fill(0));
    if (!fillBoard(board)) {
        // Bad solution, retry
        console.log("Bad board generated, retry");
        return generatePuzzle(numClues);
    }

    let removedBoard;
    let i = 1;
    do {
        console.log("Try remove ", i);
        i += 1;
        removedBoard = structuredClone(board);
        removeCells(removedBoard, 81 - numClues);
    } while(countSolutions(removedBoard) != 1);
    
    console.log("Done");
    return removedBoard
        .map(row => row.map(cell => (cell === 0 ? '.' : cell)).join(''))
        .join('');
}
