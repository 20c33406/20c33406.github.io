



class space {
        constructor(id, smallid, bigid, player, available){
            this.id = id
            this.smallid = smallid
            this.bigid = bigid
            this.player = player
            this.available = available
        }
    }
class Game {

    constructor(){
        this.on = true;
        this.playerX = 1;
        this.playerO = 2;
        this.board = Array(9).fill(null).map(() => Array(9).fill(0));
        this.winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
        ];
        let k = 0
        for(let i=0;i<9;i++){
            for(let j=0;j<9;j++){
                this.board[i][j] = new space(k,j,i,0,true)
                k++
            }
        }
    }
    
    getAvailableIds(){
        let ids = []
        for(let i=0;i<9;i++){
            for(let j=0;j<9;j++){
                if(this.board[i][j].available == true){
                    ids.push(this.board[i][j].id)
                }
            }
        }
        return ids
    }



     
    displayBoard = () => {
        let state = []
        for(let i=0;i<9;i+=3){ 
          for(let j=0;j<9;j+=3){
          state.push([this.board[i][0+j].player,this.board[i][1+j].player,this.board[i][2+j].player,this.board[i+1][0+j].player,this.board[i+1][1+j].player,this.board[i+1][2+j].player,this.board[i+2][0+j].player,this.board[i+2][1+j].player,this.board[i+2][2+j].player])
        }}
        
        for(let i=0;i<9;i++){
          for(let j=0;j<9;j++){
            if(state[i][j]==1){
              state[i][j] = "X"
            } else if(state[i][j]==2){
              state[i][j] = "O"
            } else {
              state[i][j] = "-"
              
            }
        }
        
        }
        for(let i=0;i<9;i++){
          console.log(state[i][0],state[i][1],state[i][2],state[i][3],state[i][4],state[i][5],state[i][6],state[i][7],state[i][8],)
        }
    }
    checkBoard = () => {
        let state = []
        for(let i=0;i<9;i+=3){ 
          for(let j=0;j<9;j+=3){
          state.push([this.board[i][0+j].smallid,this.board[i][1+j].smallid,this.board[i][2+j].smallid,this.board[i+1][0+j].smallid,this.board[i+1][1+j].smallid,this.board[i+1][2+j].smallid,this.board[i+2][0+j].smallid,this.board[i+2][1+j].smallid,this.board[i+2][2+j].smallid])
        }}
  
        
        
        for(let i=0;i<9;i++){
          console.log(state[i][0],state[i][1],state[i][2],state[i][3],state[i][4],state[i][5],state[i][6],state[i][7],state[i][8],)
        }
    }


    

    getSpaceById = (e) => {
        for(let i=0;i<9;i++){
            for(let j=0;j<9;j++){
                if(this.board[i][j].id == e){
                    
                    return this.board[i][j]
                }
            }
        }
    }

    

    highlightAll = () => {
        for (let j = 0; j < 81; j++) {
            this.getSpaceById(j).available = true
        }

    }

    clearAll = () => {
        for (let j = 0; j < 81; j++) {
            this.getSpaceById(j).available = false
        }

    }



    markSquareAsWon = (playerId, big) => {
        
        for (let i = 0; i < 81; i++) {
            let tspace = this.getSpaceById(i)

            if(tspace.bigid == big){
                tspace.player = playerId
            }
        }
        

        
    };

    highlightAvailableMoves = (id) => {
        
        this.clearAll()
        for(let i=0;i<81;i++){
            let lastspace = this.getSpaceById(id)
            let newspace = this.getSpaceById(i)
    
            if((newspace.player==0) && (lastspace.smallid == newspace.bigid || this.board[lastspace.smallid].every(val => val.player !== 0))){
                newspace.available=true
                
            }
        }
        

            

        
    };
    checkForWin = () => {
        let winIndicator = 0
        this.winningCombos.some(([a, b, c]) => {
            if(this.board[a].every((val, idx) => val.player !== 0 && val.player === this.board[b][idx].player && val.player === this.board[c][idx].player)){
                winIndicator = (this.board[a][0].player)
            }
        });
        if(winIndicator){
            return winIndicator
        } else if(this.boardIsFilled()) {
            return -1
        }   else {
            return 0
        }
    };

    playerHasWonSquare = (num) => {
        let winIndicator= this.winningCombos.some(([a, b, c]) => {
            if(this.board[num][a].player!=0 && this.board[num][a].player === this.board[num][b].player && this.board[num][a].player === this.board[num][c].player){
                return(this.board[num][a].player)
            }
        });
        if(winIndicator){
            return winIndicator
        }   else {
            return false
        }
    };

    boardIsFilled = () => {
      
      for(let i=0;i<9;i++){
        if(!this.isFilled(i)){
          return false
        }
      }
      return true
    }

    isFilled = (num) => {
      return this.board[num].every(val => val.player !== 0);

    };

    chooseSpace = (playerId, tempid) => {
        
        
        let tempspace = this.getSpaceById(tempid)
   


        if (tempspace.available) {

  
            tempspace.player = playerId

            if (this.playerHasWonSquare(tempspace.bigid)) {
                
                this.markSquareAsWon(playerId, tempspace.bigid);
              
                
            }
            this.highlightAvailableMoves(tempspace.id);
        }
        return false
   
    }

    get1DArrayFormatted(playerId){
        return this.board.reduce((array, line) => array.concat(
      line.map((cellValue) => {
        if (cellValue.player === 0) return 0;
        else if (cellValue.player === playerId) return 1;
        return -1;
      })
    ), []);
    };

    get1DArrayFiltered(playerId){
    // this function returns the board in a single array with
    // only the playerId chips appearing
    return this.board.reduce((array, line) => array.concat(
      line.map((cellValue) => {
        if (cellValue.player === playerId) return 1;
        else return 0;
      })
    ), []);
  }
    
    getConvolutionalVol(playerId){
    // this function aims to return a 3D array : 6*7*2 for the 2 players' chips
    // The first unit in the depth is the playerId game
    const opponentId = playerId === 1 ? 2 : 1;
    const vol = {
      sx: 9,
      sy: 9,
      depth: 2,
      w: new Float64Array(this.get1DArrayFiltered(playerId).concat(this.get1DArrayFiltered(opponentId))),
      dw: new Float64Array(9 * 9 * 2).fill(0),
    }
    return vol;
  }
}




module.exports.Game = Game