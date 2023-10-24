'use strict';

let habbits = [];
const HABBIT_KEY = 'HABBIT_KEY';
const globalState = {
    activeHabbit: undefined,
    selectedNewHabbit: 'sport'
}

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
        console.log('from loadData:', habbits)  
    }
}

function addHabbitDay(comment) {

    habbits.find(habbit => habbit.id === globalState.activeHabbit.id).days.push({"comment": comment});
    //activeHabbit.days.push({"comment": comment})
    const updatedActiveHabbit =  habbits.find(habbit => habbit.id === globalState.activeHabbit.id)
    globalState.activeHabbit = updatedActiveHabbit;
    storeData();
    renderContentMain(globalState.activeHabbit);
    updateHeader(globalState.activeHabbit);
}

function deleteHabbitDay(index) {
    habbits.find(habbit => habbit.id === globalState.activeHabbit.id).days.splice(index,1);
    storeData();
    renderContentMain(globalState.activeHabbit);
    updateHeader(globalState.activeHabbit);
}

function addHabbit() {
    const dialog = document.querySelector("dialog");
    dialog.showPopover();
}


function storeData() {
    const habbitsString = localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}


function handleSubmitFormAddHabbit(event) {
    event.preventDefault();
    const form = event.target;
    // const inputCommentField = document.querySelector('.habbit__add_list_item__input');
    const inputCommentField = form['inputForComment'];
    console.log(form);

    const formData = new FormData(event.target);
    const inputCommentFormValue = formData.get('inputForComment');
    inputCommentField.classList.remove('input__error');
    if(!inputCommentFormValue) {
        inputCommentField.classList.add('input__error');
    }
    inputCommentField.value = '';
    addHabbitDay(inputCommentFormValue);
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
    for (const i in activeHabbit.days) {
        const day = activeHabbit.days[i];
        const habbitListItem =` 
        <div class="habbit__list_item">
                <div class="habbit__list_item_day">Day${+i + 1}</div>
                <div class="habbit__list_item_comment">${day.comment}</div>
                    <button class="habbit__list_item_delete_btn" onclick="deleteHabbitDay(${i})">
                        <img src="images/delete.svg" alt="">
                    </button>
        </div>`;
        page.main.habbitList.insertAdjacentHTML('beforeend', habbitListItem);
    }
    const habbitListItemForAdd = `
        <div class="habbit__add_list_item" onsubmit="handleSubmitFormAddHabbit(event)">
            <div class="habbit__add_list_item__day">Day${activeHabbit.days.length + 1}</div>
                <form class="habbit__add_list_item__form">
                    <input name="inputForComment" class="habbit__add_list_item__input" type="text" placeholder="Comment...">
                        <img class="habbit__add_list_item__input_icon" src="images/comment.svg" alt="Add Comment">
                        <button class="habbit__add_list_item__add_btn" type="submit">
                            Add Day
                        </button>
                </form>
        </div>`;

        page.main.habbitList.insertAdjacentHTML('beforeend', habbitListItemForAdd);
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
    globalState.activeHabbit = activeHabbit;
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

function selectNewHabbit(context, habbitType) {
    console.log('fromNewHabbit: ', habbitType )
    console.log('fromNewHabbit: ', context )
    const activeIcon = document.querySelector('.menu__item_active.popover_icon');
    console.log('fromNewHabbit: ', activeIcon )
    //const queriedAllButtons = document.querySelectorAll('[data-new-habbit]');
    const forFieldForSelectedIcon = document.querySelector('[name="value_for_selected_icon"]');
    forFieldForSelectedIcon.value = habbitType;
    context.classList.add('menu__item_active');
    activeIcon.classList.remove('menu__item_active');

    /*
    console.log('fromNewHabbit: ', queriedAllButtons )
    for (const iconButton of queriedAllButtons) {
        if(iconButton.dataset.newHabbit === habbit) {
            iconButton.classList.add('menu__item_active');
        } else {
            iconButton.classList.remove('menu__item_active');
        }
    }
    globalState.selectedNewHabbit = habbit;
    */
}

function handleSubmitNewHabbit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newIcon = formData.get('value_for_selected_icon');
    const newName = formData.get('name');
    const newTarget = formData.get('target');
    console.log('fromHandleSubmitNew', newIcon, newName,newTarget)
    const newHabbit = {
            "id": habbits.length,
            "icon": "dum",
            "name": "Banch pressing",
            "target": 10,
            "days": [
                {"comment": "First attempt always going hard"},
                {"comment": "On second day is more easy"}
            ]
        }
}



/**Init */
(() => {
    loadData();
    render();
    handleActiveIcon(habbits[0]);
})()
