let configArray = []

const configInput = document.getElementById('configInput')

const usePlayer = document.getElementById('player')
const doGravity = document.getElementById('gravity')
const doCollisions = document.getElementById('collisions')

function copyConfig() {

  const configs = document.getElementById('configs')
  const cards = configs.getElementsByClassName('card')

  let config = [[usePlayer.checked, doGravity.checked, doCollisions.checked]]

  for (let i = 0; i < cards.length; i++) {
    let cardAttributes = []
    let attributes = cards[i].getElementsByTagName('input')

    for (let j = 0; j < attributes.length; j++){

      cardAttributes.push(attributes[j].value)

    }
    config.push(cardAttributes)
  }

  let JSONconfig = JSON.stringify(config)


  // Copy the text inside the text field
  navigator.clipboard.writeText(JSONconfig);

  // Alert the copied text
  alert("Copied the text: " + JSONconfig);
}

/*
  var configs = document.getElementById('configs');
 var cards = configs.getElementsByClassName('card');
 //
 for (let j = 0; j < cards.length; j++){
   let obj = []
   let inputs = cards[j].getElementsByTagName('input')
   for (let i = 0; i < inputs.length;i++){
     obj.push(inputs[i].value)
   }
   configArray.push(obj)
 }

 // Copy the text inside the text field

 navigator.clipboard.writeText(JSON.stringify(configArray));
 alert("Copied the text: " + JSON.stringify(configArray));


 configArray = []
 */

function createCard() {
  const configs = document.getElementById('configs');
  const cards = configs.getElementsByClassName('card');
  const clonedCard = cards[0].cloneNode(true);
  for (let i = 0; i < cards[0].getElementsByTagName('input').length;i++){
    clonedCard.getElementsByTagName('input')[i].value = ''
  }
  configs.appendChild(clonedCard);
};

function loadConfig() {
  const JSONconfig = configInput.value
  const config = JSON.parse(JSONconfig)

  const configs = document.getElementById('configs')
  const cards = configs.getElementsByClassName('card')

  usePlayer.checked = config[0][0]
  doGravity.checked = config[0][1]
  doCollisions.checked = config[0][2]

  for (let i = 1; i < config.length; i++){
    const clonedCard = cards[0].cloneNode(true);
    for (let j = 0; j < cards[0].getElementsByTagName('input').length;j++){
      clonedCard.getElementsByTagName('input')[j].value = config[i][j]
    }
    configs.appendChild(clonedCard);
  }
  cards[0].remove()
}
