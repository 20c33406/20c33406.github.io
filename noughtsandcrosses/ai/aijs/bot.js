// @flow
import * as QLearning from './QLearning.js';
import * as Play from './Play.js';
import * as NeuralNetwork from './NeuralNetwork.js';
import * as noughtsAndCrosses from './Game.js';
import * as Helper from './Helper.js';


// -------------- PARAMETERS ---------------- //
// type of neural network to train
const NETWORK_TYPE = 'CNN';
// number of games to play
const LEARN_TIMES = 1000;
// learningRate is progressively decreased with the number of games until
// the final value LR_INIT/LR_FINAL_FRACTION
const LR_INIT = 0.0001;
const LR_FINAL_FRACTION = 10;
// epsilon is the ratio between exploration and exploitation
// it can evolve along the games played
const EPSILON_INIT = 0.1;
const EPSILON_FINAL = 0.4;
// gamma is the fraction attributed to the maximum Q Value of the next state
const GAMMA = 0.3;
// reward awarded to the final play that led to victory
const REWARD = 100;
// discount applied to the reward awarded to the previous plays that led to victory
const DISCOUNT = 0.8;
// reward (or - reward) awarded to prevent the bot to lose
const SIDE_REWARD = 75;
// network configuration
const NETWORK_CONFIG = {
  CNN: {
    filters_number: 32,
    padding: 2,
    stride: 1,
    size: 4,
    layers : [60, 30]
  },
  NN: {
    layers: [100]
  }
}
// ------------------------------------------ //

const myNetwork = NeuralNetwork.initialize(NETWORK_TYPE, NETWORK_CONFIG);
const epsilon = EPSILON_INIT + (EPSILON_FINAL - EPSILON_INIT) * 1/2;


const chooseMove = (playerIdToPlay, availableMoves, board) => {
      const explore = !(Math.random() < epsilon);
      let spaceId;
      let output = [];
      let formattedBoard = NeuralNetwork.formatInput(networkType, board, playerIdToPlay);
      if (!explore) {
        
        output = NeuralNetwork.predict(networkType, myNetwork, formattedBoard);
        spaceId = output.indexOf(Math.max(...output));
      } else {
        
        spaceId = Helper.randomChoice(availableMoves);
      }
      return spaceId
} 


export {chooseMove}