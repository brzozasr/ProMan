// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";
import { boardHiding } from "./boards.js";
import { dragAndDrop } from "./drag_and_drop.js";
import { sockets } from "./sockets.js";
import { popupLoginHiding } from "./popup.js";
import {archive} from "./archive.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.

        sockets.init();

        document.addEventListener('keydown', e => {
            this.keyMapping(e);
        });
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
                            <span class="board-title">${boards.result[key].board_title}</span>
                            <input class="board-title-input" type="text" value="${boards.result[key].board_title}" />
                        </div>
                        <div class="board-buttons-container">
                            <div class="new-column-add-button-container board-add" style="visibility: hidden;">
                                <div class="new-column-add-button">
                                    <i class="fa fa-plus"></i>
                                    <span class="new-column-txt">Add new column</span>
                                </div>
                                <div class="new-column-add-button-input">
                                    <input type="text" class="new-column-txt-input" size="15" />
                                </div>
                            </div>
                            
                            
                            <button id="chevron-${boards.result[key].board_id}" class="board-toggle"><i class="fas fa-chevron-down"></i></button>
                            <div class="board-remove"><i class="fas fa-trash-alt"></i></div>
                        </div>
                    </div>
                    <div id="board-columns-${boards.result[key].board_id}" class="board-columns" style="display: none;"></div>
                </section>
            `;


            let boardsContainer = document.querySelector('.board-container');
            boardsContainer.insertAdjacentHTML("beforeend", boardList);

            let isPublic = boards.result[key].board_public;
            this.showColumns(boards.result[key].columns, boards.result[key].board_id, isPublic);
        }

        this.newBoardAddButton();
        popupLoginHiding.popupAddListeners();
        archive.initArchivedCards();
        dom.updateEventListeners();

        dragAndDrop.init(boards);
    },
    showColumns: function (columns, boardId, isPublic) {
        // console.dir(boardId);
        for (let column of columns) {

            let columnData = {
                col_id: column.col_id,
                col_board_id: column.col_board_id,
                card_ids: [],
                isPublic: isPublic
            };

            let columnHTML = `
                <div id="column-${column.col_id}" class="board-column" data-column-data=${JSON.stringify(columnData)}>
                    <div class="board-column-title-container">
                        <span class="board-column-title">${column.col_title}</span>
                        <input class="board-column-title-input" type="text" value="${column.col_title}" />
                        <div class="column-remove"><i class="fas fa-trash-alt"></i></div>
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
            this.newCardAddButton(column.col_id, column.col_board_id);
        }
    },
    showCards: function (cards, columnId) {
        let card_ids = [];

        for (let card of cards) {
            // console.log(cards);
            card_ids.push(card.card_id);

            let cardData = {
                card_id: card.card_id,
                card_order: card.card_order,
                column_id: card.card_col_id,
                board_id: card.card_board_id
            };
            let cardHTML = `
                
                <div class="card" id="card-${cardData.card_id}" draggable="true" data-card-data=${JSON.stringify(cardData)}>
                    <img id="archive-${cardData.card_id}" class="card-archive" src="static/img/archive.png" alt="Archive"><div class="card-remove"><i class="fas fa-trash-alt"></i></div>
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

        let column = document.getElementById(`column-${columnId}`);
        let columnDataSet = JSON.parse(column.dataset.columnData);
        columnDataSet.card_ids = [...card_ids];
        column.dataset.columnData = JSON.stringify(columnDataSet);
    },
    changeElementTitleAddEventListeners: function (elementTitleClassName, elementInputClassName) {
        let boardTitles = document.querySelectorAll(`.${elementTitleClassName}`);
        // console.log(boardTitles);

        for (let boardTitle of boardTitles) {
            boardTitle.removeEventListener('click', this.changeElementTitleClick);
        }
        for (let boardTitle of boardTitles) {
            boardTitle.addEventListener('click', this.changeElementTitleClick);
        }

        let boardInputs = document.querySelectorAll(`.${elementInputClassName}`);
        // console.log(boardInputs.length);


        for (let boardInput of boardInputs) {
            boardInput.removeEventListener('focusout', this.changeElementTitleFocus);
        }
        for (let boardInput of boardInputs) {
            boardInput.addEventListener('focusout', this.changeElementTitleFocus);
        }
    },
    newBoardAddButton: function () {
        let addButton = `
            <section id="new-board-add-button">
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
    newCardAddButton: function (columnId, boardId) {
        let addButton = `
            
                <div class="new-card-add-button-container" id="new-card-add-button-container-${columnId}">
                    <div class="new-card-add-button">
                        <i class="fa fa-plus"></i>
                        <span class="new-card-txt">Add new card</span>
                    </div>
                    <div class="new-card-add-button-input">
                        <input id="new-card-txt-input-${boardId}-${columnId}" type="text" class="new-card-txt-input" size="15" />
                    </div>
                </div>
            
        `;

        let board = document.querySelector(`#board-column-content-${columnId}`);
        board.insertAdjacentHTML('beforeend', addButton);
    },
    addNewCard: function (data) {
        let {card_id, card_order, card_title} = data.cards.reverse()[0];

        let card = document.getElementById(`card-${card_id}`);
        if (card === null) {
            let cardData = {
                card_id: card_id,
                card_order: card_order,
                column_id: data.col_id,
                board_id: data.col_board_id
            };

            let cardHTML = `
                <div class="card" id="card-${card_id}" draggable="true" data-card-data=${JSON.stringify(cardData)}>
                    <img id="archive-${card_id}" class="card-archive" src="static/img/archive.png" alt="Archive"><div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                    <div class="card-title-container">
                        <span class="card-title">${card_title}</span>
                        <input class="card-title-input" type="text" value="${card_title}" />
                    </div>
                </div>
            `;

            let column = document.querySelector(`#board-column-content-${data.col_id}`);
            column.insertAdjacentHTML('beforeend', cardHTML);

            let addCardButton = document.getElementById(`new-card-add-button-container-${data.col_id}`);
            addCardButton.lastElementChild.firstElementChild.value = '';
            addCardButton.lastElementChild.style.display = 'none';
            addCardButton.firstElementChild.style.display = 'inline-block';

            column.insertAdjacentElement('beforeend', addCardButton);
        }
    },
    addNewColumn: function (data) {

        let {col_title, col_board_id, col_id, cards} = data.columns.reverse()[0];

        let column = document.getElementById(`column-${col_id}`);
        if (column === null) {
            let columnData = {
                col_id: col_id,
                col_board_id: col_board_id,
                card_ids: []
            };

            let columnHTML = `
                <div id="column-${col_id}" class="board-column" data-column-data=${JSON.stringify(columnData)}>
                    <div class="board-column-title-container">
                        <span class="board-column-title">${col_title}</span>
                        <input class="board-column-title-input" type="text" value="${col_title}" />
                        <div class="column-remove"><i class="fas fa-trash-alt"></i></div>
                    </div>
                    <div id="board-column-content-${col_id}" class="board-column-content">
                    </div>
                </div>
            `;

            let board = document.querySelector(`#board-${col_board_id} .board-columns`);
            // console.log(`nodeName: ${board.nodeName}`);
            board.insertAdjacentHTML('beforeend', columnHTML);

            this.showCards(cards, col_id);
            this.newCardAddButton(col_id, col_board_id);
        }
    },
    loadNewBoard: function (boardTitle) {
        dataHandler.createNewBoard(boardTitle, function (board) {
            dom.addNewBoard(board);
        });
    },
    addNewBoard: function (board) {
        let boards = document.querySelectorAll('section');

        let boardTest = document.getElementById(`board-${board.board_id}`);
        if (boardTest === null) {
            let newBoard = `
                <section class="board" id="board-${board.board_id}">
                    <div class="board-header">
                        <div class="board-title-container">
                            <span class="board-title">${board.board_title}</span>
                            <input class="board-title-input" type="text" value="${board.board_title}" />
                        </div>
                        <div class="board-buttons-container">
                            <div class="new-column-add-button-container board-add" style="visibility: hidden;">
                                <div class="new-column-add-button">
                                    <i class="fa fa-plus"></i>
                                    <span class="new-column-txt">Add new column</span>
                                </div>
                                <div class="new-column-add-button-input">
                                    <input type="text" class="new-column-txt-input" size="15" />
                                </div>
                            </div>
                            
                            
                            <button id="chevron-${board.board_id}" class="board-toggle"><i class="fas fa-chevron-down"></i></button>
                            <div class="board-remove"><i class="fas fa-trash-alt"></i></div>
                        </div>
                    </div>
                    <div id="board-columns-${board.board_id}" class="board-columns" style="display: none;"></div>
                </section>
            `;

            boards[boards.length - 1].insertAdjacentHTML('afterend', newBoard);

            let isPublic = board.board_public;
            this.showColumns(board.columns, board.board_id, isPublic);
        }
    },
    removeCard: function (e, cardFromSocket) {
        if (e !== null) {
            let cardId = e.currentTarget.parentElement.id.split('-').reverse()[0];
            let card = document.getElementById(`card-${cardId}`);
            let columnData = JSON.parse(card.parentElement.parentElement.dataset.columnData);

            card.remove();

            let cardDataSet = JSON.parse(card.dataset.cardData);
            dragAndDrop.correctCardOrder(cardDataSet.column_id);

            let cardData = {
                card_id: cardId,
                card_col_id: cardDataSet.column_id,
                is_public: columnData.isPublic
            };

            dataHandler.removeCard(cardData);
        } else {
            cardFromSocket.remove();
        }
    },
    removeCardAddEventListener: function () {
        let trashIcons = document.querySelectorAll('.card-remove');
        for (let trashIcon of trashIcons) {
            trashIcon.removeEventListener('click', dom.removeCard);
            trashIcon.addEventListener('click', dom.removeCard);
        }
    },
    removeColumn: function (e, columnFromSocket) {
        if (e !== null) {
            // console.log(e.currentTarget.parentElement.parentElement.dataset.columnData);
            let columnDataSet = JSON.parse(e.currentTarget.parentElement.parentElement.dataset.columnData);
            let columnId = e.currentTarget.parentElement.parentElement.id.split('-').reverse()[0];
            let column = document.getElementById(`column-${columnId}`);
            column.remove();

            let columnData = {
                col_id: columnId,
                col_board_id: columnDataSet.col_board_id,
                is_public: columnDataSet.isPublic
            };

            console.log(columnData);

            dataHandler.removeColumn(columnData);
        } else {
            columnFromSocket.remove();
        }

    },
    removeColumnAddEventListener: function () {
        let trashIcons = document.querySelectorAll('.column-remove');
        for (let trashIcon of trashIcons) {
            trashIcon.removeEventListener('click', dom.removeColumn);
            trashIcon.addEventListener('click', dom.removeColumn);
        }
    },
    removeBoard: function (e, boardFromSocket) {
        if (e !== null ) {
            let boardId = e.currentTarget.previousElementSibling.id.split('-').reverse()[0];
            let board = document.getElementById(`board-${boardId}`);
            let column = JSON.parse(board.lastElementChild.firstElementChild.dataset.columnData);
            board.remove();

            let boardData = {
                board_id: boardId,
                is_public: column.isPublic
            };

            dataHandler.removeBoard(boardData);
        } else {
            boardFromSocket.remove();
        }

    },
    removeBoardAddEventListener: function () {
        let trashIcons = document.querySelectorAll('.board-remove');
        for (let trashIcon of trashIcons) {
            trashIcon.removeEventListener('click', dom.removeBoard);
            trashIcon.addEventListener('click', dom.removeBoard);
        }
    },
    archiveCardAddEventListener: function () {
        let archiveIcons = document.querySelectorAll('.card-archive');

        for (let archiveIcon of archiveIcons) {
            archiveIcon.removeEventListener('click', dom.archiveCard);
            archiveIcon.addEventListener('click', dom.archiveCard);
        }
    },
    archiveCard: function (e) {
        let card = e.currentTarget.parentElement;
        let cardDataSet = JSON.parse(card.dataset.cardData);
        let column = document.getElementById(`column-${cardDataSet.column_id}`);
        let columnDataSet = JSON.parse(column.dataset.columnData);

        let cardData = {
            card_id: cardDataSet.card_id,
            card_col_id: cardDataSet.column_id,
            board_public: columnDataSet.isPublic
        };

        dataHandler.archiveCard(cardData, function (archivedCards) {
            card.remove();
            dragAndDrop.correctCardOrder(cardDataSet.column_id);

            archive.addAllArchiveCards();
        });
    },
    keyMapping: function (e) {
        let activeElement = document.activeElement;

        switch (e.key) {
            case "Enter":
                // console.log('Enter');
                console.log(activeElement.className);

                try {
                    activeElement.previousElementSibling.innerText = activeElement.value;
                    activeElement.previousElementSibling.style.display = 'inline-block';


                    if (activeElement.className === 'board-title-input') {
                        let boardId = activeElement.parentElement.parentElement.parentElement.id.split('-').reverse()[0];
                        let boardTitle = activeElement.parentElement.parentElement.firstElementChild.firstElementChild.innerText;
                        let columnData = JSON.parse(activeElement.parentElement.parentElement.nextElementSibling.firstElementChild.dataset.columnData);
                        let data = {
                            board_id: boardId,
                            board_title: boardTitle,
                            is_public: columnData.isPublic
                        };
                        // console.log(`data: ${JSON.stringify(data)}`);
                        dataHandler.updateBoardName(data);
                    } else if (activeElement.className === 'board-column-title-input') {
                        let columnDataSet = JSON.parse(activeElement.parentElement.parentElement.dataset.columnData);
                        let data = {
                            col_board_id: columnDataSet.col_id,
                            col_title: activeElement.value,
                            is_public: columnDataSet.isPublic
                        };
                        // console.log(`data: ${JSON.stringify(data)}`);
                        dataHandler.updateColumnName(data);
                    } else if (activeElement.className === 'card-title-input') {
                        let cardDataSet = JSON.parse(activeElement.parentElement.parentElement.dataset.cardData);
                        let columnDataSet = JSON.parse(activeElement.parentElement.parentElement.parentElement.parentElement.dataset.columnData);
                        console.log('columnDataSet');
                        console.log(columnDataSet);
                        let data = {
                            card_id: cardDataSet.card_id,
                            card_title: activeElement.value,
                            is_public: columnDataSet.isPublic
                        };
                        // console.log(`data: ${JSON.stringify(data)}`);
                        console.log(data);
                        dataHandler.updateCardName(data);
                    }


                    activeElement.style.display = 'none';
                }
                catch {
                    if (activeElement.className === 'new-board-txt-input') {
                        let boardTitle = activeElement.value;

                        let data = {
                            board_title: boardTitle,
                        };
                        // console.log(`data: ${JSON.stringify(data)}`);
                        dataHandler.createNewBoard(data, function (data) {
                            console.log(data);
                            dom.addNewBoard(data);

                            let addNewBoardButton = document.getElementById('new-board-add-button');

                            let boardsContainer = document.querySelector('.board-container');
                            boardsContainer.insertAdjacentElement("beforeend", addNewBoardButton);

                            activeElement.parentElement.previousElementSibling.style.display = 'inline-block';

                            dom.updateEventListeners();

                            activeElement.value = '';
                            activeElement.parentElement.style.display = 'none';
                        });
                    } else if (activeElement.className === 'new-card-txt-input') {
                        let cardTitle = activeElement.value;
                        let boardId = activeElement.id.split('-').reverse()[1];
                        let columnId = activeElement.parentElement.parentElement.id.split('-').reverse()[0];

                        let columnDataSet = JSON.parse(activeElement.parentElement.parentElement.parentElement.parentElement.dataset.columnData);

                        let data = {
                            card_board_id: boardId,
                            card_col_id: columnId,
                            card_title: cardTitle,
                            is_public: columnDataSet.isPublic
                        } ;

                        // console.log(activeElement);
                        // console.log(data);
                        dataHandler.createNewCard(data, function (data) {
                            console.log(data);
                            dom.addNewCard(data);

                            dom.updateEventListeners();
                        });



                        // dataHandler._data[boardId].columns[columnId].cards
                    } else if (activeElement.className === 'new-column-txt-input') {
                        let boardId = activeElement.parentElement.parentElement.parentElement.parentElement.parentElement.id.split('-').reverse()[0];
                        let columnTitle = activeElement.value;
                        let columnDataSet = JSON.parse(activeElement.parentElement.parentElement.parentElement.parentElement.nextElementSibling.firstElementChild.dataset.columnData);
                        // console.log(`boardId: ${boardId}, columnTitle: ${columnTitle}`);
                        // this.addNewCard(cardTitle, columnId);

                        let data = {
                            col_board_id: boardId,
                            col_title: columnTitle,
                            is_public: columnDataSet.isPublic
                        } ;

                        dataHandler.createNewColumn(data, function (data) {
                            // console.log(data);
                            dom.addNewColumn(data);

                            dom.updateEventListeners();

                            activeElement.value = '';
                            activeElement.parentElement.style.display = 'none';
                            activeElement.parentElement.previousElementSibling.style.display = 'inline-block';
                        });



                        // dataHandler._data[boardId].columns[columnId].cards
                    }
                }

                break;
            case "Escape":
                e.preventDefault();
                // console.log('Escape');
                if (activeElement.style.display === 'inline-block') {
                    activeElement.previousElementSibling.style.display = 'inline-block';
                    activeElement.style.display = 'none';
                    activeElement.value = activeElement.previousElementSibling.innerText;
                } else if (activeElement.className === 'new-card-txt-input'
                    && activeElement.parentElement.style.display === 'inline-block') {
                    activeElement.parentElement.style.display = 'none';
                    activeElement.value = '';
                    activeElement.parentElement.previousElementSibling.style.display = 'inline-block';
                }
                break;
            }
    },
    changeElementTitleClick: function(e) {
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
    },
    changeElementTitleFocus: function (e) {
        // console.log('focus out');
        if (e.currentTarget.style.display === 'inline-block') {
            e.currentTarget.previousElementSibling.style.display = 'inline-block';
            // e.target.style.width = '0';
            e.currentTarget.style.display = 'none';

            if (e.currentTarget.className === 'new-card-add-button-input') {
                e.currentTarget.firstElementChild.value = '';
            } else {
                e.currentTarget.value = e.currentTarget.previousElementSibling.innerText;
            }
        }
    },
    updateEventListeners: function () {
        dom.chevronsAddListener();
        dom.changeElementTitleAddEventListeners('board-title', 'board-title-input');
        dom.changeElementTitleAddEventListeners('board-column-title', 'board-column-title-input');
        dom.changeElementTitleAddEventListeners('card-title', 'card-title-input');
        dom.changeElementTitleAddEventListeners('new-board-add-button', 'new-board-add-button-input');
        dom.changeElementTitleAddEventListeners('new-card-add-button', 'new-card-add-button-input');
        dom.changeElementTitleAddEventListeners('new-column-add-button', 'new-column-add-button-input');
        dom.removeCardAddEventListener();
        dom.removeColumnAddEventListener();
        dom.removeBoardAddEventListener();
        dom.archiveCardAddEventListener();
    },
    chevronsAddListener: boardHiding.chevronsAddListener
};
