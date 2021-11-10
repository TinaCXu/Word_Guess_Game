"use strict";
(function iife() {
    const buttonEl = document.querySelector('button');
    const inputEl = document.querySelector('input');    

    disableButtonIfNoInput();    

    function disableButtonIfNoInput() {
        inputEl.addEventListener('input', () => {
            if(inputEl.value.length === 0) {
                buttonEl.disabled = true;
            } else {
                buttonEl.disabled = false;
            }                       
        });
    }

})();