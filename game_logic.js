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

class space {
    constructor(id, smallid, bigid, player, available){
        this.id = id
        this.smallid = smallid
        this.bigid = bigid
        this.player = player
        this.available = available
    }
}




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

const fillArray = () => {
    let k = 0
    for(let i=0;i<9;i++){
        for(let j=0;j<9;j++){
            spaces[i][j] = new space(k,j,i,null,true)
            k++
        }
    }
}

const getSpaceById = (e) => {
    for(let i=0;i<9;i++){
        for(let j=0;j<9;j++){
            if(spaces[i][j].id == e){
                
                return spaces[i][j]
            }
        }
    }
}

const update = () => {
    for(let i=0;i<81;i++){
        
            
            item=getSpaceById(i)
            check = document.getElementById(i.toString())
            
            if(item.available){
                document.getElementById(i.toString()).style.backgroundColor = availableColour;
                document.getElementById(i.toString()).classList.add('available');
                
            } else {
                document.getElementById(i.toString()).style.backgroundColor = "";
                document.getElementById(i.toString()).classList.remove('available');
            }
            check.innerText = item.player
            check.style.color = item.player === X_TEXT ? 'DodgerBlue' : 'orange';
        
    }
}

const highlightAll = () => {
    for (let j = 0; j < 81; j++) {
        getSpaceById(j).available = true
    }

}

const clearAll = () => {
    for (let j = 0; j < 81; j++) {
        getSpaceById(j).available = false
    }

}

const startGame = () => {
    boxes.forEach(box => box.addEventListener('click', boxClicked));
    restartBtn.addEventListener('click', restart);
    restartBtn.removeEventListener('click', startGame);
    restart();
};

const boxClicked = (e) => {
    if (!game) return;
    restartBtn.innerText = 'Restart Game';
    tempid = parseInt(e.target.id);

    tempspace = getSpaceById(tempid)


    if (tempspace.available) {

        updatePlayerTurn(e);
        tempspace.player = currentPlayer

        if (playerHasWonSquare(tempspace.bigid)) {
            markSquareAsWon(tempspace.bigid);
            if (playerHasWon()) {
                thinger.innerHTML = `${currentPlayer} has won`;
                game = false;
            }
        }

        currentPlayer = currentPlayer === X_TEXT ? O_TEXT : X_TEXT;
        highlightAvailableMoves(tempspace.id);
    }
    update();
    
};

const updatePlayerTurn = (e) => {
    thinger.innerHTML = currentPlayer === X_TEXT ? `${O_TEXT}'s turn` : `${X_TEXT}'s turn`;
};

const markSquareAsWon = (big) => {

    for (let i = 0; i < 81; i++) {
        let tspace = getSpaceById(i)
        console.log(big)
        console.log(tspace.bigid)
        if(tspace.bigid == big){
            tspace.player = currentPlayer
        }
    }
    
    thinger.innerHTML = `${currentPlayer} has won a square`; 
    thinger.innerHTML = currentPlayer === X_TEXT ? `${O_TEXT}'s turn` : `${X_TEXT}'s turn`;
    
};

const highlightAvailableMoves = (id) => {
    clearAll()
    for(let i=0;i<81;i++){
        lastspace = getSpaceById(id)
        newspace = getSpaceById(i)

        if((!newspace.player) && (lastspace.smallid == newspace.bigid || spaces[lastspace.smallid].every(val => val.player !== null))){
            newspace.available=true
        }
    }

        

    
};
const playerHasWon = () => {
    return winningCombos.some(([a, b, c]) => {
        return spaces[a].every((val, idx) => val.player !== null && val.player === spaces[b][idx].player && val.player === spaces[c][idx].player);
    });
};

const playerHasWonSquare = (num) => {
    return winningCombos.some(([a, b, c]) => {
        return spaces[num][a].player && spaces[num][a].player === spaces[num][b].player && spaces[num][a].player === spaces[num][c].player;
    });
    
    
};

const restart = () => {
    game = true;
    lastid = null;
    spaces = Array(9).fill(null).map(() => Array(9).fill(null));
    fillArray();
    thinger.innerHTML = 'Noughts and Crosses';
    currentPlayer = X_TEXT;
    update();
   
};

const isFilled = (num) => {
    return spaces[num].every(val => val !== null);
};

restartBtn.addEventListener('click', highlightAll);


startGame();

