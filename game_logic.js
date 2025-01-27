let thinger = document.getElementById('thinger');
let restartBtn = document.getElementById('restartBtn');
let boxes = Array.from(document.getElementsByClassName('box'));
let games = Array.from(document.getElementsByClassName('gameboard'));
let game = true;
let lastid = null;
const O_TEXT = 'O';
const X_TEXT = 'X';
let currentPlayer = X_TEXT;
let availableColour = getComputedStyle(document.body).getPropertyValue('--available-blocks');
let spaces = Array(9).fill(null).map(() => Array(9).fill(null));

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
    for (let j = 0; j < 81; j++) {
        
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
    const tempbigid = parseInt(e.target.parentNode.id.slice(1, 2), 10);
    const tempsmolid = parseInt(e.target.id, 10) - 9 * tempbigid;

    if (!spaces[tempbigid][tempsmolid] && (tempbigid === lastid || lastid === null || (spaces[tempsmolid].every(val => val !== null)) && tempbigid === lastid)) {
       
        updatePlayerTurn(e);
        spaces[tempbigid][tempsmolid] = currentPlayer;
        e.target.innerText = currentPlayer;

        if (playerHasWonSquare(tempbigid)) {
            markSquareAsWon(tempbigid);
            if (playerHasWon()) {
                thinger.innerHTML = `${currentPlayer} has won`;
                game = false;
            }
        }

        currentPlayer = currentPlayer === X_TEXT ? O_TEXT : X_TEXT;
        highlightAvailableMoves(tempsmolid);
    }
};

const updatePlayerTurn = (e) => {
    thinger.innerHTML = currentPlayer === X_TEXT ? `${O_TEXT}'s turn` : `${X_TEXT}'s turn`;
    e.target.style.color = currentPlayer === X_TEXT ? 'DodgerBlue' : 'orange';
};

const markSquareAsWon = (bigid) => {
    for (let i = 0; i < 9; i++) {
        const id = bigid * 9 + i;
        document.getElementById(id.toString()).innerText = currentPlayer;
        document.getElementById(id.toString()).style.color = currentPlayer === X_TEXT ? 'DodgerBlue' : 'orange';
    }
    spaces[bigid].fill(currentPlayer);
    thinger.innerHTML = `${currentPlayer} has won a square`; 
    thinger.innerHTML = currentPlayer === X_TEXT ? `${O_TEXT}'s turn` : `${X_TEXT}'s turn`;
    
};

const highlightAvailableMoves = (smolid) => {
    if (!game) {
        alert('Game over');
        for (let j = 0; j < 81; j++) {
          
                document.getElementById(j.toString()).classList.remove('available');
            
            
        }
        return;
    }
    for (let j = 0; j < 81; j++) {
        document.getElementById(j.toString()).style.backgroundColor = '';
        
        document.getElementById(j.toString()).classList.remove('available');
    }
    for (let i = 0; i < 9; i++) {
        const id = smolid * 9 + i;
        if (spaces[smolid].some(val => val === null)) {
            document.getElementById(id.toString()).style.backgroundColor = availableColour;
            if (document.getElementById(id.toString()).innerText !== "X" && document.getElementById(id.toString()).innerText !== "O") {
                document.getElementById(id.toString()).classList.add('available');
            }
            
            lastid = smolid;
        } else {
            lastid = null;
        }
    }
    bigid = Math.floor(smolid, 9);
    if (isFilled(bigid)) {
        for (let j = 0; j < 81; j++) {
            if (document.getElementById(j.toString()).innerText !== "X" && document.getElementById(j.toString()).innerText !== "O") {
                document.getElementById(j.toString()).style.backgroundColor = availableColour;
                document.getElementById(j.toString()).classList.add('available');
            }
            
        }
    }
    
};

const playerHasWon = () => {
    return winningCombos.some(([a, b, c]) => {
        return spaces[a].every((val, idx) => val !== null && val === spaces[b][idx] && val === spaces[c][idx]);
    });
};

const playerHasWonSquare = (num) => {
    
    return winningCombos.some(([a, b, c]) => {
        return spaces[num][a] && spaces[num][a] === spaces[num][b] && spaces[num][a] === spaces[num][c];
    });
    
};

const restart = () => {
    game = true;
    lastid = null;
    spaces = Array(9).fill(null).map(() => Array(9).fill(null));
    boxes.forEach(box => {
        box.classList.remove('available');
        box.innerText = '';
        box.style.backgroundColor = '';
        box.style.color = '';
    });
    thinger.innerHTML = 'Noughts and Crosses';
    currentPlayer = X_TEXT;

    for (let j = 0; j < 81; j++) {
        
        document.getElementById(j.toString()).classList.add('available');
    }
};

const isFilled = (num) => {
    return spaces[num].every(val => val !== null);
};

restartBtn.addEventListener('click', highlightAll);
startGame();

