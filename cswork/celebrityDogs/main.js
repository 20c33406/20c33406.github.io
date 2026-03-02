// HTML tag references

const exButton = document.getElementById("exButton")
const exercise = document.getElementById("exercise")
const intButton = document.getElementById("intButton")
const intelligence = document.getElementById("intelligence")
const drool = document.getElementById("drool")
const drButton = document.getElementById("drButton")
const frButton = document.getElementById("frButton")
const friendliness = document.getElementById("friendliness")

const botexercise= document.getElementById("botexercise")
const botintelligence= document.getElementById("botintelligence")
const botdrool= document.getElementById("botdrool")
const botfriendliness= document.getElementById("botfriendliness")


const playerCardNumber = document.getElementById("playerCardNumber")
const botCardNumber = document.getElementById("botCardNumber")

const newDeckSize = document.getElementById("deckSizeInput")
const deckSubmit = document.getElementById("deckSubmit")

const dogName = document.getElementById("dogName")
const dogType = document.getElementById("dogType")
const botDogName = document.getElementById("botDogName")
const botDogType = document.getElementById("botDogType")

const currentTurn=document.getElementById("currentTurn")

const mainGame = document.getElementById("game")

const turnChooser = document.getElementById("turnChoice")
const updater = document.getElementById("updater")
const deckChooser = document.getElementById("deckChooser")
const submitButton = document.getElementById("submitButton")

const ended = document.getElementById("ended")
const botWin = document.getElementById("botWin")
const playerWin = document.getElementById("playerWin")

// The text that is displayed if you can't see the opponents card yet

const hiddenText = "Hidden"

// The turn currently being taken. 0 is the player, 1 is the bot

let turn = 0

// The list of different names and types of dog that can be created 

const dogs = [
    ["Annie","Afgan Hound"],
["Bertie","Boxer"],
["Betty","Borzoi"],
["Charlie","Chihuahua"],
["Chaz","Cocker Spaniel"],
["Donald","Dalmatian"],
["Dottie","Doberman"],
["Fern","Fox Terrier"],
["Frank","French Bulldog"],
["George","Great Dane"],
["Gertie","Greyhound"],
["Harry","Harrier"],
["Ian","Irish Wolfhound"],
["Juno","Jack Russell"],
["Keith","Kerry Blue"],
["Larry","Labrador"],
["Marge","Maltese"],
["Max","Mutt"],
["Nutty","Newfoundland"],
["Olive","Old English Sheepdog"],
["Peter","Pug"],
["Poppy","Pekingese"],
["Rosie","Rottweiler"],
["Ruby","Retriever"],
["Sam","Springer Spaniel"],
["Sukie","Saluki"],
["Vernon","Vizsla"],
["Whilma","West Highland Terrier"],
["William","Whippet"],
["Yolande","Yorkshire Terrier"],
["Barney","Banana"],
["Daniel", "French Prashad"],
["Lewis","Bulgarian Brame"],
["Oscar", "McDog"]
]

// A function that creates a random number between 1 and the arguement (inclusive)

function randNum(num){
    return Math.floor(Math.random()*num) + 1
}


// A class that creates an object with a name, type and stats

class Card {
    constructor(name, type){
        this.type = type
        this.name = name
        this.exercise = randNum(5)
        this.intelligence = randNum(100)
        this.friendliness = randNum(10)
        this.drool = randNum(10)
       
    }

    // A method of the card class that compares the card it is in to the card in the arguement given a specific stat

    compare(card, stat){
        if(stat=="exercise"){
            return card.exercise<=this.exercise
        } else if (stat=="intelligence"){
            return card.intelligence<=this.intelligence
        } else if (stat=="friendliness"){
            return card.friendliness<=this.friendliness
        } else if (stat=="drool"){
            return card.drool>=this.drool
        }
    }
}

// A class deck that creates a new deck of random cards with the length of the arguement

class Deck {
    constructor(len){
        let tdogs=dogs
        this.cards =[]
        for(let i=0;i<len;i++){
            
            let ind = Math.floor(Math.random()*tdogs.length)
            let ind2 = Math.floor(Math.random()*tdogs.length)
            let newCard = new Card(tdogs[ind][0], tdogs[ind2][1])
            this.cards.push(newCard)
            

        }
    }
    
}

// A player class that has a hand attribute which is a stack that will contain the cards and a getTopCard method which takes the top card from the stack and an addCard method which adds a card to the stack.

class Player {
    constructor(){
        
        this.hand = []
        
       
    }
    getTopCard(){
        let temp = this.hand[0]
        this.hand.splice(0,1)
        return temp
    }
    addCard(card){
        this.hand.push(card)
    }
    
}

// The code that executes after the player takes their turn

function botTurn(){
    
    updateHTML()

    // Delays the code by 5 seconds

    setTimeout(function() {
  

    let tbotcard = bot.getTopCard()
    let tplayercard = player.getTopCard()
    let trandnum = randNum(4)

    if(trandnum==1){
        let stat = "exercise"
        if(tbotcard.compare(tplayercard,stat)){
            bot.addCard(tbotcard)
            bot.addCard(tplayercard)
            updater.innerText = (`The bot's card's ${stat} was better than yours so you lost`)
        } else {
            player.addCard(tbotcard)
            player.addCard(tplayercard)
            updater.innerText = (`The bot's card's ${stat} was worse than yours so you won!`)
        }
    } else if(trandnum==2){
        let stat = "intelligence"
        if(tbotcard.compare(tplayercard,stat)){
            bot.addCard(tbotcard)
            bot.addCard(tplayercard)
            updater.innerText = (`The bot's card's ${stat} was better than yours so you lost`)
        } else {
            player.addCard(tbotcard)
            player.addCard(tplayercard)
            updater.innerText = (`The bot's card's ${stat} was worse than yours so you won!`)
        }
    } else if(trandnum==3){
        let stat = "friendliness"
        if(tbotcard.compare(tplayercard,stat)){
            bot.addCard(tbotcard)
            bot.addCard(tplayercard)
            updater.innerText = (`The bot's card's ${stat} was better than yours so you lost`)
        } else {
            player.addCard(tbotcard)
            player.addCard(tplayercard)
            updater.innerText = (`The bot's card's ${stat} was worse than yours so you won!`)
        }
    } else if(trandnum==4){
        let stat = "drool"
        if(tbotcard.compare(tplayercard,stat)){
            bot.addCard(tbotcard)
            bot.addCard(tplayercard)
            updater.innerText = (`The bot's card's ${stat} was better than yours so you lost`)
        } else {
            player.addCard(tbotcard)
            player.addCard(tplayercard)
            updater.innerText = (`The bot's card's ${stat} was worse than yours so you won!`)
        }
    } 

    // Checks if the game is over

    if(bot.hand.length==0){
        endGame(0)
        return
    }
    if(player.hand.length==0){
        endGame(1)
        return
    }
    updatePlayerHand(player.hand[0])
    turn = 0
    updateTurn("player")
    playerCardNumber.innerText= player.hand.length
    botCardNumber.innerText= bot.hand.length
    }, 5000);
}

// The code that executes when the player picks a stat

function playerTurn(stat){
    // Returns if it is not the players turn.
    if(turn==1){
        return
    }
    
    turn = 1
    let tbotcard = bot.getTopCard()
    let tplayercard = player.getTopCard()
  

    if(stat=="exercise"){
        if(tplayercard.compare(tbotcard,"exercise")){
            player.addCard(tbotcard)
            player.addCard(tplayercard)
            updater.innerText = (`Your card's ${stat} was better than the bot's so you won!`)
        } else {
            bot.addCard(tbotcard)
            bot.addCard(tplayercard)
            updater.innerText = (`Your card's ${stat} was not better than the bot's so you lost`)
        }
    } else if(stat=="intelligence"){
        if(tplayercard.compare(tbotcard,"intelligence")){
            player.addCard(tbotcard)
            player.addCard(tplayercard)
             updater.innerText = (`Your card's ${stat} was better than the bot's so you won!`)
        } else {
            bot.addCard(tbotcard)
            bot.addCard(tplayercard)
            updater.innerText = (`Your card's ${stat} was not better than the bot's so you lost`)
        }
    } else if(stat=="friendliness"){
        if(tplayercard.compare(tbotcard,"friendliness")){
            player.addCard(tbotcard)
            player.addCard(tplayercard)
            updater.innerText = (`Your card's ${stat} was better than the bot's so you won!`)
        } else {
            bot.addCard(tbotcard)
            bot.addCard(tplayercard)
            updater.innerText = (`Your card's ${stat} was not better than the bot's so you lost`)
        }
    } else if(stat=="drool"){
        if(tplayercard.compare(tbotcard,"drool")){
            player.addCard(tbotcard)
            player.addCard(tplayercard)
            updater.innerText = (`Your card's ${stat} was better than the bot's so you won!`)
        } else {
            bot.addCard(tbotcard)
            bot.addCard(tplayercard)
            updater.innerText = (`Your card's ${stat} was not better than the bot's so you lost`)
        }
    } 

    // Checks if the game is over
    if(bot.hand.length==0){
        endGame(0)
        return
    }
    if(player.hand.length==0){
        endGame(1)
        return
    }
    updateBotHand(tbotcard)
    playerCardNumber.innerText= player.hand.length
    botCardNumber.innerText= bot.hand.length
    
    // Delays the code so the player can see why the lost/won before the bot plays

    setTimeout(function() {
        updateTurn("bot")
        botTurn()
        
    }, 3000);

   

}

// updates the HTML to the current top card of the bot and the player

function updateHTML(){
    
    dogName.innerHTML = player.hand[0].name
    dogType.innerHTML = player.hand[0].type
    intelligence.innerHTML = player.hand[0].intelligence
    exercise.innerHTML = player.hand[0].exercise
    friendliness.innerHTML = player.hand[0].friendliness
    drool.innerHTML = player.hand[0].drool

    botDogName.innerHTML = bot.hand[0].name
    botDogType.innerHTML = bot.hand[0].type
    botintelligence.innerHTML = bot.hand[0].intelligence
    botexercise.innerHTML = bot.hand[0].exercise
    botfriendliness.innerHTML = bot.hand[0].friendliness
    botdrool.innerHTML = bot.hand[0].drool
    

}

// Updates the HTML to display the current player card and hides the bot card

function updatePlayerHand(card){
    console.log(player.hand[0])
    dogName.innerHTML = player.hand[0].name
    dogType.innerHTML = player.hand[0].type
    intelligence.innerHTML = card.intelligence
    exercise.innerHTML = card.exercise
    friendliness.innerHTML = card.friendliness
    drool.innerHTML = card.drool

    botDogName.innerHTML = hiddenText
    botDogType.innerHTML = hiddenText
    botintelligence.innerHTML = hiddenText
    botexercise.innerHTML = hiddenText
    botfriendliness.innerHTML = hiddenText
    botdrool.innerHTML = hiddenText
}

// Updates the HTML to include the bot card stats

function updateBotHand(card){
    botDogName.innerHTML = bot.hand[0].name
    botDogType.innerHTML = bot.hand[0].type
    botintelligence.innerHTML = card.intelligence
    botexercise.innerHTML = card.exercise
    botfriendliness.innerHTML = card.friendliness
    botdrool.innerHTML = card.drool
}

// The code that displays the final screen of the game

function endGame(won){
    mainGame.hidden = true
    ended.hidden = false
    if(won==0){
        playerWin.hidden = false
    } else {
        botWin.hidden = false
    }
}

// The code that runs the player turn when the different options for stats are clicked

function exclick(){
    playerTurn("exercise")
}
function intclick(){
    playerTurn("intelligence")
}
function frclick(){
    playerTurn("friendliness")
}
function drclick(){
    playerTurn("drool")
}

// sends the cards from the deck to the players

function sendCards(cards){
    let deck = new Deck(cards)
    let deckl = deck.cards.length
    for(let i=0;i<deckl/2;i++){
        let tcard = deck.cards.splice(0,1)
        bot.addCard(tcard)
        tcard = deck.cards.splice(0,1)
        player.addCard(tcard)
    }
    
    
}

// Changes the HTML when the turn changes

function updateTurn(turnName){
    if(turn==0){
       
        currentTurn.innerText = turnName
        turnChooser.hidden = false

    } else {
   
        currentTurn.innerText = turnName
        turnChooser.hidden = true
    }
    
}

// Fixes a weird bug I have where the cards in the hands of the players would be the card object in an array. This takes it out

function fixHands (){
    for(let i=0;i<player.hand.length;i++){
        player.hand[i] = player.hand[i][0]
    }
    for(let i=0;i<bot.hand.length;i++){
        bot.hand[i] = bot.hand[i][0]
    }
}

// Creates the bot, player and sets the onclick functions for the stat selectors

const bot = new Player()
const player = new Player()
exButton.onclick = exclick
intButton.onclick = intclick
frButton.onclick = frclick
drButton.onclick = drclick

// The code that exectutes when the number of total cards in the deck is submitted.

function onSubmitClick(){
    
    mainGame.hidden = false
    deckChooser.hidden = true
    let cards = Number(document.getElementById("cardNum").value)
    

    sendCards(cards)  
    fixHands()
    playerCardNumber.innerText= player.hand.length
    botCardNumber.innerText= bot.hand.length
    updatePlayerHand(player.hand[0])

}

