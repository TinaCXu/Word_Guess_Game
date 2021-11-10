"use strict";
const words = require('./words');

const gameWeb = {
    loginPage: function(isValid, errorMsg) {
        return `
            <!doctype html>
            <html>
                <head>
                    <title>Guess Game</title>
                    <link rel="stylesheet" href="style.css"/>
                </head>
            <body>
                <div id="home-page">
                    <h1>Guess Word Game</h1>
                    <div class="login-panel">
                        <h2>LOGIN</h2>
                        <form action="/login" method="POST">
                            <input name="username" value="" placeholder="Enter Username"/>
                            <button type="submit" disabled>Login</button>
                        </form>
                        <p>username should only contain number or letter</p>
                        ${gameWeb.getErrorMessage(isValid, errorMsg)}
                    </div>
                </div>
                <script src="home-client.js"></script>
            </body>
            </html>

        `
    },

    gamePage: function(userData) {
        return `
            <!doctype html>
            <html>
                <head>
                    <title>Guess Game</title>
                    <link rel="stylesheet" href="style.css"/>
                </head>
            <body>
                <div id="home-page">
                    <h1>Guess Word Game</h1>
                    <div class="game-panel">                        
                        ${gameWeb.getGuessHistoryPanel(userData)}
                        ${gameWeb.getGuessedOption(userData)}
                        ${gameWeb.getRestartOption(userData)}
                        <form action="/logout" method="POST">
                            <button type="submit">Logout</button>
                        </form>                        
                    </div>
                </div>
                <script src="game-client.js"></script>                
            </body>
            </html>
        `        
    }, 

    getErrorMessage: function(isValid, errorMsg) {
        if(isValid) {
            return ``
        } else {
            return `
                <p>${errorMsg}</p>
            `
        }
    },

    getGamePanel: function() {
        return `
            <p class="note"></p>
            <form action="/guess" method="POST">
                <input name="guessedWord" value="" placeholder="Enter a word">
                <button class="guess" type="submit" disabled>Guess</button>
            </form>
        `
    },

    getWordList: function() {
        let wordLists = words.words2List();
        const html = Object.values(wordLists).map( wl =>  `
            <li class="word">
                <p>${wl.join()}</p>
            </li>
        `).join('');
        return html;
    },

    getGuessHistoryPanel: function(userData) {
        return `
            <h2>Guess History</h2>
            ${gameWeb.getRecentGuess(userData)}
            <h3>Previous Guessed Word List</h3>
            <ul class="guessed-list">
                ${gameWeb.getGuessedList(userData)}
            </ul>
            <p>Number of valid guesses:${userData.validGuess}</p>

            
            <h2>Possibe word list:</h2>
            <ul class="words">
                ${gameWeb.getWordList()}
            </ul>
        `
    },

    getRecentGuess: function(userData) {
        if(userData.latestGuessValid) {//valid
            return `
                <p>Most recent guess is: ${userData.latestGuess}</p>
            `
        } else {//not valid
            return `
                <p>Most recent guess is not valid. Please select a word from given list</p>
            `
        }
    },

    getGuessedList: function(userData) {
        const html = Object.values(userData.guessHistory).map( gh => `
            <li class="guessed-word">
                <p>Guessed word: ${gh.word} - Number of letter matched:${gh.match}</p>
            </li>
        `).join('');
        return html;
    },

    getGuessedOption: function(userData) {
        if(userData.latestGuessCorrect) {
            return `
                <h2>Congratulation! You won!</h2>
            `
        } else {
            return `
                <h3 class="try-title">Try to guess a word!</h3>
                ${gameWeb.getGamePanel()}
            `
        }
    },

    getRestartOption: function(userData) {
        if(userData.firstLogin) {//first login, no need restart
            return``
        } else {
            return `
                <form action="/new-game" method="POST">
                    <button type="submit">Start A New Game</button>
                </form>
            `
        }
    }

};
module.exports = gameWeb;