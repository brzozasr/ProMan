// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";
import { boardHiding } from "./boards.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.

    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function(boards){
            dom.showBoards(boards);
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also

        for(let board of boards){

            let boardList = `
                <section class="board" id="board-${board.id}">
                    <div class="board-header">
                        <div class="board-title-container">
                            <span class="board-title">Board ${board.id}</span>
                            <input class="board-title-input" type="text" value="Board ${board.id}" />
                        </div>
                        <div class="board-buttons-container">
                            <button id="board-add-${board.id}" class="board-add" style="visibility: hidden;">Add Card</button>
                            <button id="chevron-${board.id}" class="board-toggle"><i class="fas fa-chevron-down"></i></button>
                        </div>
                    </div>
                    <div id="board-columns-${board.id}" class="board-columns" style="display: none;"></div>
                </section>
            `;


            let boardsContainer = document.querySelector('.board-container');
            boardsContainer.insertAdjacentHTML("beforeend", boardList);

            this.loadCards(board.id);
        }



        let boardTitles = document.querySelectorAll('.board-title');
        console.log(boardTitles);
        for (let boardTitle of boardTitles) {
            boardTitle.addEventListener('click', (e) => {
                console.log(e.target.nodeName);
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'inline-block';
                e.target.nextElementSibling.focus();
                e.target.nextElementSibling.select();
                // e.target.nextElementSibling.style.width = '150px';
                // console.log(`p1: ${e.target.classList}`);
            });
        }

        let boardInputs = document.querySelectorAll('.board-title-input');
        console.log(boardInputs.length);
        document.addEventListener('keydown', e => {
            this.keyMapping(e, boardInputs);
        });

        for (let boardInput of boardInputs) {
            boardInput.addEventListener('focusout', e => {
                console.log('focus out');
                if (e.target.style.display === 'inline-block') {
                    e.target.previousElementSibling.style.display = 'inline-block';
                    // e.target.style.width = '0';
                    e.target.style.display = 'none';

                    e.target.value = e.target.previousElementSibling.innerText;
                }
            })
        }

        this.chevronsAddListener();
    },
    loadStatuses: function() {
        dataHandler.getStatuses(function(statuses){
            dom.showBoards(statuses);
        });
    },
    showStatuses: function(statuses) {

    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
        dataHandler.getCardsByBoardId(boardId, function(cards){
            dom.showCards(cards);
        });
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
        let statusIDs = []
        for (let card of cards) {
            statusIDs.push(card.status_id);
        }
        let statusIDsUniq = [...new Set(statusIDs)].sort();
        // console.log(statusIDsUniq);

        let boardId = cards[0].board_id;


        for (let statusID of statusIDsUniq) {
            console.log(statusID);
            let cardList = '';

            for (let card of cards) {

                if (card.status_id === statusID) {
                    cardList += `
                        <div class="card">
                            <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                            <div class="card-title">${card.title}</div>
                        </div>
                    `;
                }
            }

            this.loadStatus(statusID, cardList, boardId);

        }
        // let promises = [];
        //
        // for (let statusID of statusIDs) {
        //     promises.push(function () {
        //         return new Promise(resolve => {
        //
        //         })
        //     })
        // }
        // this.loadStatus(statusID, cardList, boardId);
    },
    // here comes more features
    loadStatus: function (statusId, cardList, boardId) {
        // retrieves cards and makes showCards called

        dataHandler.getStatus(statusId, function(statusName){
            dom.showStatus(statusName, cardList, boardId);
        });
    },
    showStatus: function(statusName, cardList, boardId) {
        console.log(statusName);
        let column = `
            <div class="board-column">
                <div class="board-column-title">${statusName}</div>
                <div class="board-column-content">
                    ${cardList}
                </div>
            </div>
        `;

        // let board = document.getElementById(`board-${boardId}`);
        let board = document.querySelector(`#board-${boardId} .board-columns`);
        console.log(`nodeName: ${board.nodeName}`);
        board.insertAdjacentHTML('beforeend', column);
    },
    keyMapping: function (e, boardInputs) {
        switch (e.key) {
            case "Enter":
                console.log('Enter');


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
                console.log('Escape');
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
