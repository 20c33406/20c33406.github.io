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

const hiddenText = "REDACTED"
let turn = 0


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


function randNum(num){
    return Math.floor(Math.random()*num) + 1
}




class Card {
    constructor(name, type){
        this.type = type
        this.name = name
        this.exercise = randNum(5)
        this.intelligence = randNum(100)
        this.friendliness = randNum(10)
        this.drool = randNum(10)
        this.description = (`Name: ${this.name}\nExercise: ${this.exercise}\nIntelligence: ${this.intelligence}\nFriendliness: ${this.friendliness}\nDrool: ${this.drool}`)
    }
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

class Deck {
    constructor(len){
        let tdogs=dogs
        this.cards =[]
        for(let i=0;i<len;i++){
            
            let ind = Math.floor(Math.random()*tdogs.length)
            let ind2 = Math.floor(Math.random()*tdogs.length)
            this.cards.push(new Card(tdogs[ind][0], tdogs[ind2][1]))
            

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
    constructor(){
        
        this.hand = []
        this.currentCard;
       
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
function botTurn(){
    
    updateHTML()
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
function playerTurn(stat){
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
    
    setTimeout(function() {
        updateTurn("bot")
        botTurn()
        
    }, 3000);

   

}


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


function updatePlayerHand(card){
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

function updateBotHand(card){
    botDogName.innerHTML = bot.hand[0].name
    botDogType.innerHTML = bot.hand[0].type
    botintelligence.innerHTML = card.intelligence
    botexercise.innerHTML = card.exercise
    botfriendliness.innerHTML = card.friendliness
    botdrool.innerHTML = card.drool
}

function endGame(won){
    mainGame.hidden = true
    ended.hidden = false
    if(won==0){
        playerWin.hidden = false
    } else {
        botWin.hidden = false
    }
}


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
function sendCards(cards){
    let deck = new Deck(cards)
    for(let i=0;i<cards/2;i++){
        bot.addCard(deck.takeRandom())
        player.addCard(deck.takeRandom())
    }
}

function updateTurn(turnName){
    if(turn==0){
       
        currentTurn.innerText = turnName
        turnChooser.hidden = false

    } else {
   
        currentTurn.innerText = turnName
        turnChooser.hidden = true
    }
    
}

const bot = new Player()
const player = new Player()
exButton.onclick = exclick
intButton.onclick = intclick
frButton.onclick = frclick
drButton.onclick = drclick

let form = document.getElementById("form");
function handleForm(event) { event.preventDefault(); } 
form.addEventListener('submit', onSubmitClick);
function onSubmitClick(){
    
    mainGame.hidden = false
    deckChooser.hidden = true
    let cards = Number(document.getElementById("cardNum").value)
    

    sendCards(cards)
    playerCardNumber.innerText= player.hand.length
    botCardNumber.innerText= bot.hand.length
    updatePlayerHand(player.hand[0])

}



