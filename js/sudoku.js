
function createDataObjects() {
    let allCells = "ABCDEFGHI".split('').map(r => "123456789".split("").map(c => (r+c))).flat();
    let rows = "ABCDEFGHI".split('').map(r => allCells.filter(cell => cell.includes(r)));
    let columns = "123456789".split('').map(r => allCells.filter(cell => cell.includes(r)));
    let squares = ["ABC", "DEF", "GHI"].flatMap(ur => ["123", "456", "789"].map(uc => permutate(ur,uc)));
    unitsList = rows.concat(columns).concat(squares);
    let units = {};
    allCells.forEach(cell => {
        units[cell] = unitsList.filter(u => u.includes(cell));
    });

    let peers = {};
    allCells.forEach(cell => {
        peersObj = {};
        units[cell].forEach(u => u.forEach(peer => peersObj[peer] = 1));
        delete peersObj[cell];
        peers[cell] = Object.keys(peersObj);
    });

    return {
        allCells,
        unitsList,
        units,
        peers
    };
}



function permutate(s1,s2) {
    let res = [];
    for (c1 of s1) {
        for (c2 of s2) {
            res.push(c1+c2)
        }
    }
    return res;
}