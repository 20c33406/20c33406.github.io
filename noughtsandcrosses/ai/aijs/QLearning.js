
const NeuralNetwork = require('./NeuralNetwork');


exports.trainOnPreviousPlays = (
  networkType,
  myNetwork,
  myTrainer,
  boards,
  plays,
  learningRate,
  reward,
  discount,
  gamma,
) => {
  const playsLength = plays.length;
  let previousQValue = NeuralNetwork.predict(
    networkType,
    myNetwork,
    boards[playsLength - 1],
  );
  
  // backpropagate on the previous winnerPlays
  for (let playIndex = playsLength - 2; playIndex >= 0; playIndex--) {
    NeuralNetwork.backPropagate(
      networkType,
      myTrainer,
      boards[playIndex],
      discount ** (playsLength - playIndex - 1) * reward + gamma * Math.max(...previousQValue),
      plays[playIndex],
      learningRate
    )
    previousQValue = NeuralNetwork.predict(
      networkType,
      myNetwork,
      boards[playIndex],
    );
  }
}