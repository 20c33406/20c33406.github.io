// Fetches all of the HTML elements
const generatedPassword = document.getElementById("passwordText")
const generatedPasswordStrength = document.getElementById("generatedStrengthText")
const passwordStrength = document.getElementById("strengthText")
const generatePasswordButton = document.getElementById("generate")
const passwordForm = document.getElementById("passwordForm")
const submittedPassword = document.getElementById("passwordInput")
const strengthLevelText = document.getElementById("strLevelText")

// Defines character sets
let alphabet = "abcdefghijklmnopqrstuvwxyz"
let specialChars = ["!", "$", "%", "^", "&", "*", "(", ")", "-", "_", "=", "+"]
let qwerty = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"]
]

chars =  "abcdefghijklmnopqrstuvwxyz!$%^&*()_+=-1234567890"


// Function to return the score of a password
function checkPasswordStrength(input){
    score = 0

    // Add the length to the score
    score += input.length

    // Check if the password has a lowercase, uppercase, numerical and special character
    upper = false
    lower = false
    numb = false
    spec = false
   
    if(input.toLowerCase() != input){
        score+=5
        upper = true
    }
    if(input.toUpperCase() != input){
        score += 5
        lower = true
    }
    
    for(let i=0;i<10;i++){
        if(input.includes(String(i))){
                score += 5
                numb = true
                break
        }
    }

    for(let i=0;i<specialChars.length;i++){
        if(input.includes(specialChars[i])){
                score += 5
                spec = true
                break
        }
    }
 

    // Check if there is one of each type of character
    if(upper && lower && numb && spec){
        score += 10
    }
    // Check if there are only lowercase and uppercase characters
    if(upper && lower && !numb && !spec){
        score -= 10
    }
    // Check if there are only numbers
    if(!upper && !lower && numb && !spec){
        score -= 5
        
    }
    // Check if there are only special characters
    if(!upper && !lower && !numb && spec){
        score -= 5
    }

    // For each consecutive 3 character string that matches the qwerty keyboard horizontally, subtract 5 score
    for(let i=0;i<qwerty.length;i++){
        for(let j=0;j<qwerty[i].length-2;j++){
            consecutiveLetters = [qwerty[i][j],qwerty[i][j+1],qwerty[i][j+2]].join("")
            if(input.toLowerCase().includes(consecutiveLetters)){
                score-=5
                
            }
        }
    }

    return score

}

// Function to generate password
function generatePassword(){

    let generated = "";
    
    // Loop until the score is higher than 20
    while(checkPasswordStrength(generated)<=20){
        generated = ""

        // Generate length of password
        len = Math.floor(Math.random()*5)+8
        
        // Adds a random character from the full charset 
        for(let i=0;i<len;i++){
            generated += chars[Math.floor(Math.random()*chars.length)]
        }
        
    }
    
    // Once the score is higher than 20, display the password and score
    generatedPassword.innerHTML = generated
    generatedPasswordStrength.innerHTML = checkPasswordStrength(generated)
}

function checkPassword(){

    // Define the input and the input score
    let input = submittedPassword.value
    let score = checkPasswordStrength(input)

    // If the input contains characters that are not in the allowed charset then throw an err
    for(let i=0;i<input.length;i++){
        if(!chars.includes(input[i].toLowerCase())){
            passwordStrength.innerText = "Please make sure your password only uses accepted characters"
            return false
        }
    }

    // Display the score and the score level
    passwordStrength.innerText = score
    if(score>20){
        strengthLevelText.innerHTML = "Strong"
    } else if (score<=0){
        strengthLevelText.innerHTML = "Weak"
    } else {
        strengthLevelText.innerHTML = "Medium"
    }
    
    return false
    
}

// Define the functions for the form submission and button press
passwordForm.onsubmit = checkPassword
generatePasswordButton.onclick = generatePassword
