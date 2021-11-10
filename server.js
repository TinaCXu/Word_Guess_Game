"use stricts";
const express = require('express');
const app = express();
const PORT = 3000;
const cookieParser = require('cookie-parser');

const sessions = require('./sessions');
const homePage = require('./home-page');
const users = require('./users');
const guesses = require('./guesses');
const words = require('./words');

app.use(express.static('./public'));
app.use(cookieParser());

app.get('/', (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : '';    
    let isValid = true;
    let errorMsg = ``;
    if(!sid)  {//haven't logged in        
        res.send(homePage.loginPage(isValid, errorMsg));
        return;
    }
    if(!username)  {//invalid session id    
        let isValid = false;
        let errorMsg = `Session ID has expired, login again!`;    
        res.send(homePage.loginPage(isValid, errorMsg));
        return;
    }

    //already logged in
    let existingUserData = users.getUserData(username);
    res.send(homePage.gamePage(existingUserData));
    
})

app.post('/login', express.urlencoded({ extended: false }), (req, res) => {    
    const username = req.body.username.trim();        
    const numberOrLetterOnly = username.match(new RegExp('^[a-zA-Z0-9]+$'));    
    let isValid = true;
    let errorMsg = ``;
    if(!username) {
        isValid = false;
        errorMsg = `Login Error: required username`;
        res.status(400).send(homePage.loginPage(isValid, errorMsg));
        return;
    }
    if(username === `dog`) {
        isValid = false;
        errorMsg = `Login Error: username should not be dog`;
        res.status(403).send(homePage.loginPage(isValid, errorMsg));
        return;
    }
    if(numberOrLetterOnly == null) {
        isValid = false;
        errorMsg = `Login Error: numbers and letters only`;
        res.status(403).send(homePage.loginPage(isValid, errorMsg));
        return;
    }
    const sid = sessions.addSession(username);
    const existingUserData = users.getUserData(username);    
    if(!existingUserData) {
        users.addUserData(username, guesses.makeNewHistory(username));
    }

    res.cookie('sid', sid);
    res.redirect('/');        
})

app.post('/guess', express.urlencoded({ extended: false }),(req, res) => {    
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : '';    
    
    //test manual changing cookie
    // sessions.deleteSession(sid);

    if(!sid || !username)  {//no valid session id     
        let isValid = false;
        let errorMsg = `Session ID has expired, login again!`;    
        res.send(homePage.loginPage(isValid, errorMsg));
        return;
    }    

    let guessedWord = req.body.guessedWord;
    guessedWord = req.body.guessedWord.trim();

    const existingUserData = users.getUserData(username);
    const answer = existingUserData.answer;

    if(!guessedWord || words.checkValid(guessedWord) == false) {
        existingUserData.latestGuessValid = false;        
    } else {        
        existingUserData.checkAndAddLatestGuess(guessedWord, answer);                
    }
    existingUserData.firstLogin = false;
    res.redirect('/');    
})

app.post('/new-game', (req, res) => {    
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : '';    

    //test manual changing cookie
    // sessions.deleteSession(sid);

    if(!sid || !username)  {//no valid session id     
        let isValid = false;
        let errorMsg = `Session ID has expired, login again!`;    
        res.send(homePage.loginPage(isValid, errorMsg));
        return;
    }    

    let existingUserData = users.getUserData(username);    
    existingUserData.restartGame();
    res.redirect('/');
})

app.post('/logout', (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : '';
    if(sid) {
        res.clearCookie('sid');
    }
    if(username) {
        sessions.deleteSession(sid);
    }
    res.redirect('/');
})

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
