var board;

const human = 'O';

const computer = 'X';

const wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

const cells = document.querySelectorAll('.cell');

startGame();

function startGame() {

    document.querySelectorAll('.endgame').display = "none";

    board = Array.from(Array(9).keys());

    for (var i = 0; i < cells.length; i++) {
        cells[i].innerHTML = "";
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', cellClicked, false);
    }

}


function cellClicked(event) {
    highlight(event.target.id, human);
}

function highlight(cellid, player) {
    board[cellid] = player;
    document.getElementById(cellid).innerHTML = player;
    let gameWon = checkWin(board, player);
    if (gameWon) {
        gameOver(gameWon);
    }
}

function checkWin(board, player) {
    let plays = board.reduce((accumulator, value, index) =>
        (value === player) ? accumulator.concat(index) : accumulator, []);

    let gameWon = null;

    for (let [index, combo] of wins.entries()) {
        if (combo.every(each => plays.indexOf(each) > -1)) {
            gameWon = { index: index, player: player };
            break;
        }
    }
    return gameWon;

}

function gameOver(gameWon) {
    for (let index of wins[gameWon.index]) {
        document.getElementById(index).style.backgroundColor = gameWon.player == human ? "green" : "red";
    }

    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', cellClicked, false);
    }
}