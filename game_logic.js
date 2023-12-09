let playerText = document.getElementById('playerText')
let restartBtn = document.getElementById('restartBtn')
let boxes = Array.from(Array.from(document.getElementsByClassName('box')))
let games = Array.from(Array.from(document.getElementsByClassName('gameboard')))
game = true
empty = true
var availableColour = getComputedStyle(document.body).getPropertyValue('--available-blocks')
lastid = null;
const O_TEXT = 'O'
const X_TEXT = 'X'
let currentPlayer = X_TEXT
let spaces = [
    board0 = [null, null, null,null, null, null,null, null, null],
    board1 = [null, null, null,null, null, null,null, null, null],
    board2 = [null, null, null,null, null, null,null, null, null],
    board3 = [null, null, null,null, null, null,null, null, null],
    board4 = [null, null, null,null, null, null,null, null, null],
    board5 = [null, null, null,null, null, null,null, null, null],
    board6 = [null, null, null,null, null, null,null, null, null],
    board7 = [null, null, null,null, null, null,null, null, null],
    board8 = [null, null, null,null, null, null,null, null, null]
]
const startGame = () => {
    boxes.forEach(box => box.addEventListener('click', boxClicked))
    
}


function boxClicked(e) {
    
    if(game == true){
        
        const tempbigid = parseInt(e.target.parentNode.id.slice(1,2), 10)
        const tempsmolid = parseInt(e.target.id, 10) - 9*tempbigid
        
    console.log(spaces[tempsmolid].toString().replace(/\,/g, ''))
    if(!spaces[tempbigid][tempsmolid] && (tempbigid == lastid || lastid == null) && (spaces[tempsmolid].toString().replace(/\,/g, '').length != 9 || !(spaces[tempsmolid].toString() != "X,X,X,X,X,X,X,X,X" && spaces[tempsmolid].toString() != "O,O,O,O,O,O,O,O,O"))){
        playerText.innerHTML = 'Noughts and Crosses'
        const bigid = parseInt(e.target.parentNode.id.slice(1,2), 10)
        const smolid = parseInt(e.target.id, 10) - 9*bigid
        spaces[bigid][smolid] = currentPlayer
        e.target.innerText = currentPlayer
        
        
            if(playerHasWonSquare(bigid.toString()) !== false){
                
                for (let i=0; i<9; i++)  {
                    idd = bigid * 9 + i
                    document.getElementById(idd.toString()).innerText = currentPlayer
                    
                    
                }
                
                
                spaces[bigid].fill(currentPlayer)
                playerText.innerHTML = `${currentPlayer} has won a square`
                
                for (let i=0; i<9; i++)  {
                    
                    idddd = lastid * 9 + i
                    
                    
                    
                    document.getElementById(idddd.toString()).style.backgroundColor = ''
                    
                    
                    
                    
                }
                if(playerHasWon()){
                    playerText.innerHTML = `${currentPlayer} has won`
                    game = false
                }

                
                
            }
        
        currentPlayer = currentPlayer == X_TEXT ? O_TEXT : X_TEXT
        for (let j = 0; j <81; j++){
            document.getElementById(j.toString()).style.backgroundColor = ''
        }
        for (let i=0; i<9; i++)  {
            idd = smolid * 9 + i
            idddd = bigid * 9 + i
            
            
            
            document.getElementById(idddd.toString()).style.backgroundColor = ''
            
            
            if (spaces[smolid].toString() != "X,X,X,X,X,X,X,X,X" && spaces[smolid].toString() != "O,O,O,O,O,O,O,O,O") {
            document.getElementById(idd.toString()).style.backgroundColor = availableColour
            
            lastid = smolid
            } else {
                lastid = null
            }
            
        e.target.style.backgroundColor = 'navy'
    }
    
}
    }
}



const winningCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]
function playerHasWon(){
    for (const condition of winningCombos) {
        let [a, b, c] = condition
        for (let k=0; k<spaces[a].length; k++) {
            if (spaces[a][k] != null && spaces[b][k] != null && spaces[c][k] != null) {
                
                
            
              if((spaces[a].toString() == spaces[b].toString() && spaces[a].toString() == spaces[c].toString())) {
                
                return true;
                
            }
            
            }
            }
          }
        
    return false
}

function playerHasWonSquare(num) {

    
        
        
        
        for (const condition of winningCombos) {
        let [a, b, c] = condition

        if(spaces[num][a] && (spaces[num][a] == spaces[num][b] && spaces[num][a] == spaces[num][c])) {
            
            return [num][a,b,c]
        }}
    
    return false
}

restartBtn.addEventListener('click', restart)

function restart() {
    game = true
    lastid = null
    spaces.forEach((element) => element.fill(null));
    
    
    boxes.forEach( box => {
        box.innerText = ''
        box.style.backgroundColor=''
    })
    
    playerText.innerHTML = 'Noughts and Crosses'

    currentPlayer = X_TEXT
}

startGame()