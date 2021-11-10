"use strict";
(function iife() {
    const buttonEl = document.querySelector('.guess');
    const inputEl = document.querySelector('input');    
    const noteEl = document.querySelector('.note');    
    const wordEl = Array.from(document.querySelectorAll("ul > li")).map(el => el.innerHTML).join(" ").split(/[\s\n(<p>)(</p>),]+/).filter( item => !!item );

    if(inputEl) {
        disableButtonIfNoInput();    
        disableButtonIfUnacceptableGuess();    
    }

    function disableButtonIfNoInput() {
        inputEl.addEventListener('input', () => {
            if(inputEl.value.length === 0) {
                buttonEl.disabled = true;
            } else {
                buttonEl.disabled = false;
            }                       
        });
    }

    function disableButtonIfUnacceptableGuess() {
        inputEl.addEventListener('focusout', () => {
            const value = inputEl.value;
            if(wordEl.includes(value.toLocaleLowerCase())) {
                buttonEl.disabled = false;                
            } else {
                buttonEl.disabled = true;
                noteEl.innerHTML = 'Invalid guess, please select a word from given list.';
                inputEl.value = '';
            }
        });        
    }

})();