//      
const noughtsAndCrosses = require('./Game');
const Helper = require('./Helper');
const NeuralNetwork = require('./NeuralNetwork');

exports.playGame = (networkType, epsilon, myNetwork, display) => {
  let winnerBoardStates = [];
  let winnerPlays = [];
  let loserBoardStates = [];
  let loserPlays = [];
  const game = new noughtsAndCrosses.Game();
  const boardStatesAsPlayer1 = [];
  const boardStatesAsPlayer2 = [];
  const playsAsPlayer1 = [];
  const playsAsPlayer2 = [];

  let playerIdToPlay = 1;
  let pat = false;
  let winner = 0;
  while (!pat && !winner) {
    // Play
    const explore = !(Math.random() < epsilon);
    let spaceId;
    let output = [];
    let formattedBoard = NeuralNetwork.formatInput(networkType, game.board, playerIdToPlay);
    if (!explore) {
      
      output = NeuralNetwork.predict(networkType, myNetwork, formattedBoard);
      spaceId = output.indexOf(Math.max(...output));
    } else {
      
      spaceId = Helper.randomChoice(game.getAvailableIds());
    }

    let playAgain = game.chooseSpace(playerIdToPlay, spaceId);
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
          break;
        case -1:
          // Pat
          pat = true;
          break;
        case 1:
          // Player 1 won
          winner = 1;
          break;
        case 2:
          // Player 2 won
          winner = 2;
          break;
        default:
          break;
      }
    } else {
      
    }
  }
  if (winner > 0) {
    winnerBoardStates = winner === 1 ? boardStatesAsPlayer1 : boardStatesAsPlayer2;
    winnerPlays = winner === 1 ? playsAsPlayer1 : playsAsPlayer2;
    loserBoardStates = winner === 1 ? boardStatesAsPlayer2 : boardStatesAsPlayer1;
    loserPlays = winner === 1 ? playsAsPlayer2 : playsAsPlayer1;
  }
  if (display) game.displayBoard();
  return {
    winnerBoardStates,
    winnerPlays,
    loserBoardStates,
    loserPlays,
  }
}