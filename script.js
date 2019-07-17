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

var gameEnded = false;

startGame();

function startGame() {
    gameEnded = false;

    document.querySelector('.endgame').style.display = "none";

    board = Array.from(Array(9).keys());

    for (var i = 0; i < cells.length; i++) {
        cells[i].innerHTML = "";
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', cellClicked, false);
    }

}


function cellClicked(event) {
    if (typeof board[event.target.id] == 'number') {
        highlight(event.target.id, human);
        if (!gameEnded  && !checkTie()) {
            highlight(bestSpot(), computer);
        }
    }
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
    declareWinner(gameWon.player==human?"You won!":"You lose!");
}

function checkTie() {
    if(emptySquares().length==0){
        for(var i=0;i<cells.length;i++){
            cells[i].style.backgroundColor = "orange";
            cells[i].removeEventListener('click',cellClicked,false);
        }

        declareWinner("Tie Game!");

        return true;
    }
    return false;
}

function bestSpot() {

    return minmax(board,computer).index;
    // Dumb Algo
    // return emptySquares()[0];
}

function emptySquares() {
    return board.filter(each => typeof each == 'number');
}

function declareWinner(who){
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerHTML = who;
    gameEnded = true;
}

function minmax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, human)) {
		return {score: -10};
	} else if (checkWin(newBoard, computer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == computer) {
			var result = minmax(newBoard, human);
			move.score = result.score;
		} else {
			var result = minmax(newBoard, computer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === computer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}
