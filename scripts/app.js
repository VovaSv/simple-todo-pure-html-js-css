'use strict';

let habbits = [];
const HABBIT_KEY = 'HABBIT_KEY';

const page = {
    menu: document.querySelector('.menu__list'),
    header: {
        h1: document.querySelector('h1'),
        progressPercent: document.querySelector('.progress__percent'),
        progressCoverBar: document.querySelector('.progress__bar_fill'),
    },
    main: {
        habbitList: document.querySelector('.habbit__list')
    }
}

function loadData() {
    const habbitsString = localStorage.getItem(HABBIT_KEY);
    const habbitsArray = JSON.parse(habbitsString);
    if(Array.isArray(habbitsArray)) {
        habbits = habbitsArray;
        console.log(habbits)  
    }
}


function storeData() {
    const habbitsString = localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}


function renderMenu() {
    for (const habbit of habbits) {
        const queriedButton = document.querySelector(`[data-habbit-id="${habbit.id}"]`);
        console.log("queriedButton: ", queriedButton)
        if(!queriedButton) {
            const element = document.createElement('button');
            element.dataset.habbitId = habbit.id;
            element.classList.add('menu__item');
            element.addEventListener('click', () => handleActiveIcon(habbit))
            element.innerHTML = `<img src="images/${habbit.icon}.svg" alt="${habbit.name}">`;
            page.menu.appendChild(element);
            console.log('page menu', page.menu)
        }
    }
}

function renderContentMain(activeHabbit) {

    page.main.habbitList.innerHTML = '';
    const node = document.querySelector('.habbit__list')
    for (let i = 0; i < activeHabbit.days.length; i++) {
        const day = activeHabbit.days[i];
        const habbitListItem =` 
        <div class="habbit__list_item">
        <div class="habbit__list_item_day">Day${i + 1}</div>
        <div class="habbit__list_item_comment">${day.comment}</div>
            <button class="habbit__list_item_delete_btn">
                <img src="images/delete.svg" alt="">
            </button>
        </div>`;
        page.main.habbitList.insertAdjacentHTML('beforeend', habbitListItem);
    }
}

function updateHeader(activeHabbit) {
    page.header.h1.innerText = activeHabbit.name;
    const progress = activeHabbit.days.length / activeHabbit.target > 1 
    ? 100
    : activeHabbit.days.length / activeHabbit.target * 100;
    page.header.progressPercent.innerText = progress.toFixed(0) + '%';
    page.header.progressCoverBar.setAttribute('style', `width: ${progress}%`)
}

function render() {
    renderMenu();
}

function handleActiveIcon(activeHabbit) {
    updateHeader(activeHabbit);
    renderContentMain(activeHabbit);
    for (const habbit of habbits) {
        const queriedButton = document.querySelector(`[data-habbit-id="${habbit.id}"]`);
        if(activeHabbit.id === habbit.id) {
            queriedButton.classList.add('menu__item_active');
        } else {
            queriedButton.classList.remove('menu__item_active');
        }
    }
}



/**Init */
(() => {
    loadData();
    render();
    handleActiveIcon(habbits[0]);
})()
