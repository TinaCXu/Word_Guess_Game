const guessList = new Array();
const words = require('./words');

const sessions = require('./sessions');

function makeNewHistory(username) {
    let size = guessList.length;
    guessList[size] = {
        name: username,
        answer: words.words[Math.floor(Math.random() * (words.words.length - 0) + 0)],        
        validGuess: 0,
        guessHistory: new Array(),
        latestGuessValid: true,
        latestGuessCorrect: false,             
        latestGuess: '',
        firstLogin: true,
    };
    
    let currData = guessList[size];
    console.log('New game for:' + username + ', answer is:' + currData.answer);

    currData.checkAndAddLatestGuess = function checkAndAddLatestGuess(guessedWord, answer) {
        //check data
        let inputGuessed = guessedWord.toLowerCase();
        let inputAnswer = answer.toLowerCase();
        let result = 0;
    
        for(let value of inputAnswer) {
            for(let idx = 0; idx < inputGuessed.length; idx++) {
                if(value === inputGuessed[idx]) {
                    result ++;
                    inputGuessed = inputGuessed.substring(0, idx) + inputGuessed.substring(idx + 1, inputGuessed.length);
                }
            }
        }
        //add data
        this.guessHistory[this.guessHistory.length] = {
            word: guessedWord,
            match: result,
        }        
        this.validGuess += 1;
        this.latestGuessValid = true;
        this.latestGuessCorrect = result === answer.length ? true : false;                
        this.latestGuess = guessedWord + `, number of matched letter is: ` + result;        
    }   

    currData.restartGame = function restartGame() {
        this.answer = words.words[Math.floor(Math.random() * (words.words.length - 0) + 0)];
        this.validGuess = 0;
        this.guessHistory = new Array();
        this.latestGuessValid = true;
        this.latestGuessCorrect = false;             
        this.latestGuess = '';
        this.firstLogin = false;
        console.log('New game for:' + username + ', answer is:' + this.answer);
    }
    return guessList[guessList.length - 1];
}


module.exports = {
    guessList,
    makeNewHistory,

}