fs = require("fs"); 
prompt = require("prompt-sync")();

let dogs = []

fs.readFile("dogs.txt", function(err, data){ 
    if(err){ 
        throw err 
    } 
    dogs = data.split("\n")
});

function randNum(num){
    return Math.floor(Math.random()*num) + 1
}




class Card {
    constructor(name){
        this.name = name
        this.exercise = randNum(5)
        this.intelligence = randNum(100)
        this.friendliness = randNum(10)
        this.drool = randNum(10)
        this.description = (`Name: ${this.name}\nExercise: ${this.exercise}\nIntelligence: ${this.intelligence}\nFriendliness: ${this.friendliness}\nDrool: ${this.drool}`)
    }
    
}

class Deck {
    constructor(len){
        this.cards =[]
        for(let i=0;i<len;i++){
            this.cards.push(new Card(dogs[Math.floor(Math.random()*dogs.length)]))

        }
    }
    takeRandom(){
        let temp = Math.floor(Math.random()*dogs.length)
        let tempcard = this.cards[temp]
        this.cards.splice(temp,1)
        return tempcard
    }
}


class Player {
    constructor(name){
        this.name = name
        this.hand = []
    }
}










