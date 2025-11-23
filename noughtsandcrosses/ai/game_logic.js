import * as noughtsAndCrosses from "./aijs/Game.js"
import * as bot from "./aijs/bot.js"

const X_TEXT = "X"
const O_TEXT = "O"

const X_COLOUR = 'DodgerBlue'
const O_COLOUR = 'orange'

const playerText = X_TEXT
const botText = O_TEXT

const playerColour = X_COLOUR
const botColour = O_COLOUR

let thinger = document.getElementById('thinger');
let restartBtn = document.getElementById('restartBtn');

let boxes = Array.from(document.getElementsByClassName('box'));





let pat = false;
let winner = 0;

let on = true


const swapSign = () => {
    playerText = playerText==X_TEXT ? O_TEXT : X_TEXT
    playerColour = playerColour==X_COLOUR ? O_COLOUR : X_COLOUR

    botText = botText==X_TEXT ? O_TEXT : X_TEXT
    botColour = botColour==X_COLOUR ? O_COLOUR : X_COLOUR


}

const update = () => {
    for(let i=0;i<81;i++){
            item=game.getSpaceById(i)
            check = document.getElementById(i.toString())
            
            if(item.available){
                check.style.backgroundColor = availableColour;
                check.classList.add('available');
                
            } else {
                check.style.backgroundColor = "";
                check.classList.remove('available');
            }
            check.innerText = item.player===1 ? playerText : botText
            if(item.player==1){
                check.style.color = playerColour
            } else {
                 check.style.color = botColour
            }
            
    }
}



const boxClicked = (e) => {
    if (!on || currentPlayer==2) return;
    restartBtn.innerText = 'Restart Game';
    tempid = parseInt(e.target.id);
    game.chooseSpace(1,tempid)
    update()
    const explore = !(Math.random() < epsilon);

    let output = [];
    let formattedBoard = NeuralNetwork.formatInput(networkType, game.board, playerIdToPlay);
    let spaceId = bot.chooseMove(2, game.getAvailableIds(), game.board)
    let playAgain = game.chooseSpace(2, spaceId);
    if(playsAsPlayer1.includes(spaceId) || playsAsPlayer2.includes(spaceId)){playAgain=true};
    // The same player may have to play again if the column he chose was full
    if (!playAgain) {
      // Save board states and plays
      if (playerIdToPlay === 1) {
        boardStatesAsPlayer1.push(formattedBoard);
        playsAsPlayer1.push(spaceId);
      } else if (playerIdToPlay === 2) {
        boardStatesAsPlayer2.push(formattedBoard);
        playsAsPlayer2.push(spaceId);
      }
      
      // Check for wins
      const gameState = game.checkForWin();
      /*
      game.displayBoard()
      console.log(gameState)
      console.log(game.getSpaceById(spaceId).bigid,game.getSpaceById(spaceId).smallid, spaceId, playerIdToPlay)
      console.log("------------------------")
      */
      switch (gameState) {
        case 0:
          // Nobody won, switch player
          playerIdToPlay = playerIdToPlay === 1 ? 2 : 1;
          
        case -1:
          // Pat
          pat = true;
          on = false
        case 1:
          // Player 1 won
          winner = 1;
          on = false
        case 2:
          // Player 2 won
          winner = 2;
          on = false
        default:
          break;
      }
    } else {
        return
    }
    update()
}


boxes.forEach(box => box.addEventListener('click', boxClicked));
console.log(noughtsAndCrosses)
const game = new noughtsAndCrosses.Game();
console.log(game.board)
update();
