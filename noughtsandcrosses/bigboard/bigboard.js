let thinger = document.getElementById('thinger');
let restartBtn = document.getElementById('restartBtn');
let boxes = Array.from(document.getElementsByClassName('cell'));
let games = Array.from(document.getElementsByClassName('inner-grid'));
let outerGames = Array.from(document.getElementsByClassName('outer-grid'));
let game = true;
let lastid = null;
const O_TEXT = 'O';
const X_TEXT = 'X';
let currentPlayer = X_TEXT;
let availableColour = getComputedStyle(document.body).getPropertyValue('--available-blocks');
let spaces = Array(9).fill(null).map(() => Array(9).fill(null).map(() => Array(9).fill(null)))

const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const highlightAll = () => {
    for (let j = 0; j < 729; j++) {
        document.getElementById(j.toString()).classList.add('available');
    }
}

const startGame = () => {
    boxes.forEach(box => box.addEventListener('click', boxClicked));
    restartBtn.addEventListener('click', restart);
    restartBtn.removeEventListener('click', startGame);
};

const boxClicked = (e) => {
    if (!game) return;
    restartBtn.innerText = 'Restart Game';
    let tempOuterId = parseInt(e.target.parentNode.parentNode.id.slice(-1), 10);
    let tempBigId = parseInt(e.target.parentNode.id.slice(-1), 10);
    let tempSmallId = parseInt(e.target.id, 10) - (9 * tempBigId) - (81 * tempOuterId);
    
    if (!spaces[tempOuterId][tempBigId][tempSmallId] && (tempBigId === lastid || lastid === null || (spaces[tempOuterId][tempSmallId].every(val => val !== null)) && tempBigId === lastid)) {
        updatePlayerTurn(e);
        spaces[tempOuterId][tempBigId][tempSmallId] = currentPlayer;
        e.target.innerText = currentPlayer;
        

        if (playerHasWonSquare(tempOuterId, tempBigId)) {
            markSquareAsWon(tempOuterId, tempBigId);
            if (playerHasWonOuterGame(tempOuterId)) {
                markOuterGameAsWon(tempOuterId);
                if (playerHasWon()) {
                    thinger.innerHTML = `${currentPlayer} has won the game`;
                    for (let j = 0; j < 729; j++) {
                        document.getElementById(j).innerText = currentPlayer;
                        document.getElementById(j).style.color = currentPlayer === X_TEXT ? 'DodgerBlue' : 'orange';
                        
                    }
                    game = false;
                }
            }
        }

        currentPlayer = currentPlayer === X_TEXT ? O_TEXT : X_TEXT;
        highlightAvailableMoves(tempBigId, tempSmallId);
    }
};

const updatePlayerTurn = (e) => {
    thinger.innerHTML = currentPlayer === X_TEXT ? `${O_TEXT}'s turn` : `${X_TEXT}'s turn`;
    e.target.style.color = currentPlayer === X_TEXT ? 'DodgerBlue' : 'orange';
};

const markSquareAsWon = (outerId, bigId) => {
    for (let i = 0; i < 9; i++) {
        const id = outerId * 81 + bigId * 9 + i;
        document.getElementById(id.toString()).innerText = currentPlayer;
        document.getElementById(id.toString()).style.color = currentPlayer === X_TEXT ? 'DodgerBlue' : 'orange';
    
    }
    spaces[outerId][bigId].fill(currentPlayer);
    thinger.innerHTML = `${currentPlayer} has won a square`;
    thinger.innerHTML = currentPlayer === X_TEXT ? `${O_TEXT}'s turn` : `${X_TEXT}'s turn`;
};

const markOuterGameAsWon = (outerId) => {
    for (let i = 0; i < 81; i++) {
        const id = outerId * 81 + i;
        document.getElementById(id.toString()).innerText = currentPlayer;
        document.getElementById(id.toString()).style.color = currentPlayer === X_TEXT ? 'DodgerBlue' : 'orange';
    }
    spaces[outerId].fill(Array(9).fill(currentPlayer));
    thinger.innerHTML = `${currentPlayer} has won an outer game`;
    thinger.innerHTML = currentPlayer === X_TEXT ? `${O_TEXT}'s turn` : `${X_TEXT}'s turn`;
};

const highlightAvailableMoves = (outerId, smallId) => {
    
    if (!game) {
        for (let j = 0; j < 729; j++) {
            document.getElementById(j).classList.remove('available');
        }
        return;
    }
    for (let j = 0; j < 729; j++) {
        document.getElementById(j).style.backgroundColor = '';
        document.getElementById(j).classList.remove('available');
    }
    for (let i = 0; i < 9; i++) {
        const id = outerId * 81 + smallId * 9 + i;
      
        if (spaces[outerId][smallId].some(val => val === null)) {
            if (document.getElementById(id).innerText !== "X" && document.getElementById(id).innerText !== "O") {
                document.getElementById(id).classList.add('available');
            }
            lastid = smallId;
        } else {
            lastid = null;
        }
    }
    if (innerIsFilled(outerId, smallId)) {
        
        for (let j = 0; j < 81; j++) {
            if (document.getElementById(j.toString()).innerText !== "X" && document.getElementById(j.toString()).innerText !== "O") {
                idthing = j + (81 * outerId);
                document.getElementById(j.toString()).style.backgroundColor = availableColour;
                document.getElementById(j.toString()).classList.add('available');
            }
        }
        
    }
    if (outerIsFilled(outerId)) {
        for (let j = 0; j < 729; j++) {
            document.getElementById(j).style.backgroundColor = '';
            document.getElementById(j).classList.remove('available');
        }
        for (let j = 0; j < 9; j++) {

            for (let i = 0; i < 9; i++) {
                availableBox = spaces[j][smallId][i];
                availableBoxId = j * 81 + smallId * 9 + i;
                if (availableBox !== "X" && availableBox !== "O") {
                    document.getElementById(availableBoxId).style.backgroundColor = availableColour;
                    document.getElementById(availableBoxId).classList.add('available');
                }
            }
       
           
        }
    }
    
};

const playerHasWon = () => {
    return winningCombos.some(([a, b, c]) => {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (!spaces[a][i][j] && spaces[a][i][j] === spaces[b][i][j] && spaces[a][i][j] === spaces[c][i][j]){
                    return false;
                }
               
            }
        }
        return true;

    });
};

const playerHasWonSquare = (outerId, bigId) => {
    return winningCombos.some(([a, b, c]) => {
        return spaces[outerId][bigId][a] && spaces[outerId][bigId][a] === spaces[outerId][bigId][b] && spaces[outerId][bigId][a] === spaces[outerId][bigId][c];
    });
};

const playerHasWonOuterGame = (outerId) => {
    return winningCombos.some(([a, b, c]) => {
        return spaces[outerId][a].every((val, idx) => val !== null && val === spaces[outerId][b][idx] && val === spaces[outerId][c][idx]);
    });
};

const restart = () => {
    game = true;
    lastid = null;
    spaces = Array(9).fill(null).map(() => Array(9).fill(null).map(() => Array(9).fill(null)));
    boxes.forEach(box => {
        box.classList.remove('available');
        box.innerText = '';
        box.style.backgroundColor = '';
        box.style.color = '';
    });
    thinger.innerHTML = 'Noughts and Crosses';
    currentPlayer = X_TEXT;

    for (let j = 0; j < 729; j++) {
        document.getElementById(j.toString()).classList.add('available');
    }
};

const innerIsFilled = (outerId, num) => {
    return spaces[outerId][num].every(val => val !== null);
};
const outerIsFilled = (outerId) => {
    
    for(let i = 0; i < 9; i++) {
    
        if (spaces[outerId][i].some(val => val === null)) {
            return false;
        }
    }
    
    return true;
      
};
restartBtn.addEventListener('click', highlightAll);
startGame();
