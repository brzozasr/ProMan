// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";
import { boardHiding } from "./boards.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.

    },
    loadAllData: function () {
        dataHandler.getAllData(function(boards) {
            dom.showAllData(boards);
        });
    },
    showAllData: function (boards) {
        for (let key of Object.keys(boards.result)) {
            // console.log(key);

            let boardList = `
                <section class="board" id="board-${boards.result[key].board_id}">
                    <div class="board-header">
                        <div class="board-title-container">
                            <span class="board-title">Board ${boards.result[key].board_id}</span>
                            <input class="board-title-input" type="text" value="Board ${boards.result[key].board_id}" />
                        </div>
                        <div class="board-buttons-container">
                            <button id="board-add-${boards.result[key].board_id}" class="board-add" style="visibility: hidden;">Add Card</button>
                            <button id="chevron-${boards.result[key].board_id}" class="board-toggle"><i class="fas fa-chevron-down"></i></button>
                        </div>
                    </div>
                    <div id="board-columns-${boards.result[key].board_id}" class="board-columns" style="display: none;"></div>
                </section>
            `;


            let boardsContainer = document.querySelector('.board-container');
            boardsContainer.insertAdjacentHTML("beforeend", boardList);

            this.showColumns(boards.result[key].columns, boards.result[key].board_id);
        }

        this.chevronsAddListener();
        
        this.changeElementTitleAddEventListeners('board-title', 'board-title-input');
        this.changeElementTitleAddEventListeners('board-column-title', 'board-column-title-input');
        this.changeElementTitleAddEventListeners('card-title', 'card-title-input');
        this.newBoardAddButton();
        this.changeElementTitleAddEventListeners('new-board-add-button', 'new-board-add-button-input');
    },
    showColumns: function (columns, boardId) {
        // console.dir(boardId);
        for (let column of columns) {

            let columnHTML = `
                <div class="board-column">
                    <div class="board-column-title-container">
                        <span class="board-column-title">${column.col_title}</span>
                        <input class="board-column-title-input" type="text" value="${column.col_title}" />
                    </div>
                    <div id="board-column-content-${column.col_id}" class="board-column-content">
                    </div>
                </div>
            `;

            // let board = document.getElementById(`board-${boardId}`);
            let board = document.querySelector(`#board-${boardId} .board-columns`);
            // console.log(`nodeName: ${board.nodeName}`);
            board.insertAdjacentHTML('beforeend', columnHTML);

            this.showCards(column.cards, column.col_id);
        }
    },
    showCards: function (cards, columnId) {
        for (let card of cards) {
            // console.log(cards);
            let cardHTML = `
                <div class="card" draggable="true">
                    <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                    <div class="card-title-container">
                        <span class="card-title">${card.card_title}</span>
                        <input class="card-title-input" type="text" value="${card.card_title}" />
                    </div>
                </div>
            `;

            let board = document.querySelector(`#board-column-content-${columnId}`);
            // console.log(`nodeName: ${board.nodeName}`);
            board.insertAdjacentHTML('beforeend', cardHTML);
        }
    },
    changeElementTitleAddEventListeners: function (elementTitleClassName, elementInputClassName) {
        let boardTitles = document.querySelectorAll(`.${elementTitleClassName}`);
        // console.log(boardTitles);
        for (let boardTitle of boardTitles) {
            boardTitle.addEventListener('click', (e) => {
                // console.log(e.target.nodeName);
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling.style.display = 'inline-block';

                try {
                    e.currentTarget.nextElementSibling.querySelector('input').focus();
                    e.currentTarget.nextElementSibling.querySelector('input').select();
                }
                catch {
                    e.currentTarget.nextElementSibling.focus();
                    e.currentTarget.nextElementSibling.select();
                }

                // if (e.currentTarget.nextElementSibling.querySelector('input').focus() === null) {
                //     e.currentTarget.nextElementSibling.focus();
                // }
                // if (e.currentTarget.nextElementSibling.querySelector('input').select() === null) {
                //     e.currentTarget.nextElementSibling.select();
                // }

                // e.target.nextElementSibling.style.width = '150px';
                // console.log(`p1: ${e.target.classList}`);
            });
        }

        let boardInputs = document.querySelectorAll(`.${elementInputClassName}`);
        // console.log(boardInputs.length);
        document.addEventListener('keydown', e => {
            this.keyMapping(e, boardInputs);
        });

        for (let boardInput of boardInputs) {
            boardInput.addEventListener('focusout', e => {
                // console.log('focus out');
                if (e.currentTarget.style.display === 'inline-block') {
                    e.currentTarget.previousElementSibling.style.display = 'inline-block';
                    // e.target.style.width = '0';
                    e.currentTarget.style.display = 'none';

                    e.currentTarget.value = e.currentTarget.previousElementSibling.innerText;
                }
            })
        }
    },
    newBoardAddButton: function () {
        let addButton = `
            <section>
                <div class="new-board-add-button-container">
                    <div class="new-board-add-button">
                        <i class="fa fa-plus"></i>
                        <span class="new-board-txt">Add new board</span>
                    </div>
                    <div class="new-board-add-button-input">
                        <input type="text" class="new-board-txt-input" size="15" />
                    </div>
                </div>
            </section>
        `;

        let boardsContainer = document.querySelector('.board-container');
        boardsContainer.insertAdjacentHTML("beforeend", addButton);


    },
    addNewBoard: function () {
        let boards = document.querySelectorAll('section');

        let newBoard = `
            
        `;
    },
    keyMapping: function (e, boardInputs) {
        let activeElement = document.activeElement;

        switch (e.key) {
            case "Enter":
                // console.log('Enter');

                try {
                    activeElement.previousElementSibling.innerText = activeElement.value;
                    activeElement.previousElementSibling.style.display = 'inline-block';
                }
                catch {
                    activeElement.parentElement.parentElement.firstElementChild.lastElementChild.innerText = activeElement.value;
                    activeElement.parentElement.parentElement.firstElementChild.lastElementChild.style.display = 'inline-block';
                }

                activeElement.style.display = 'none';

                break;
            case "Escape":
                e.preventDefault();
                // console.log('Escape');
                for (let boardInput of boardInputs) {
                    if (activeElement.style.display === 'inline-block') {
                        activeElement.previousElementSibling.style.display = 'inline-block';
                        activeElement.style.display = 'none';
                        activeElement.value = boardInput.previousElementSibling.innerText;
                    }
                }
                break;
            }
    },
    chevronsAddListener: boardHiding.chevronsAddListener
};
