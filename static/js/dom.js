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
    },
    showColumns: function (columns, boardId) {
        // console.dir(boardId);
        for (let column of columns) {

            let columnHTML = `
                <div class="board-column">
                    <div class="board-column-title-container">
                        <div class="board-column-title">${column.col_title}</div>
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
                        <div class="card-title">${card.card_title}</div>
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
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'inline-block';
                e.target.nextElementSibling.focus();
                e.target.nextElementSibling.select();
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
                if (e.target.style.display === 'inline-block') {
                    e.target.previousElementSibling.style.display = 'inline-block';
                    // e.target.style.width = '0';
                    e.target.style.display = 'none';

                    e.target.value = e.target.previousElementSibling.innerText;
                }
            })
        }
    },
    keyMapping: function (e, boardInputs) {
        switch (e.key) {
            case "Enter":
                // console.log('Enter');


                for (let boardInput of boardInputs) {
                    if (boardInput.style.display === 'inline-block') {

                        boardInput.previousElementSibling.style.display = 'inline-block';
                        boardInput.previousElementSibling.innerText = boardInput.value;
                        boardInput.style.display = 'none';
                    }
                }
                break;
            case "Escape":
                e.preventDefault();
                // console.log('Escape');
                for (let boardInput of boardInputs) {
                    if (boardInput.style.display === 'inline-block') {
                        boardInput.previousElementSibling.style.display = 'inline-block';
                        boardInput.style.display = 'none';
                        boardInput.value = boardInput.previousElementSibling.innerText;
                    }
                }
                break;
            }
    },
    chevronsAddListener: boardHiding.chevronsAddListener
};
