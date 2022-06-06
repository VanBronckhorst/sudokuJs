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