'use strict';

let habbits = [];
const HABBIT_KEY = 'HABBIT_KEY';

function loadData() {
    const habbitsString = localStorage.getItem(HABBIT_KEY);
    const habbitsArray = JSON.parse(habbitsString);
    if(Array.isArray(habbitsArray)) {
        habbits = habbitsArray;
        console.log(habbits)  
    }
}


function saveData() {
    const habbitsString = localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

(() => {
    loadData();
})()
