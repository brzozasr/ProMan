import { dom } from "./dom.js";
import {dragAndDrop} from "./drag_and_drop.js";
import {archive} from "./archive.js";

export let sockets = {
    init: function () {
        let socket = io();

        socket.on('boardNameChange', function(data) {
            console.log(data);

            let board = document.getElementById(`board-${data.data.board_id}`);
            let boardTitle = board.firstElementChild.firstElementChild.firstElementChild;
            let boardTitleInput = boardTitle.nextElementSibling;

            boardTitle.innerText = data.data.board_title;
            boardTitleInput.value = data.data.board_title;
        });

        socket.on('columnNameChange', function(data) {
            console.log(data);

            let column = document.getElementById(`column-${data.data.col_board_id}`);
            let columnTitle = column.firstElementChild.firstElementChild;
            let columnTitleInput = columnTitle.nextElementSibling;

            columnTitle.innerText = data.data.col_title;
            columnTitleInput.value = data.data.col_title;
        });

        socket.on('cardNameChange', function(data) {
            console.log(data);

            let card = document.getElementById(`card-${data.data.card_id}`);
            let cardTitle = card.lastElementChild.firstElementChild;
            let cardTitleInput = cardTitle.nextElementSibling;

            cardTitle.innerText = data.data.card_title;
            cardTitleInput.value = data.data.card_title;
        });

        socket.on('removeCard', function(data) {
            console.log(data);

            let cardFromSocket = document.getElementById(`card-${data.data.card_id}`);
            if (cardFromSocket !== null) {
                dom.removeCard(null, cardFromSocket);
            }
        });

        socket.on('removeColumn', function(data) {
            console.log(data);

            let columnFromSocket = document.getElementById(`column-${data.data.col_id}`);
            if (columnFromSocket !== null) {
                dom.removeColumn(null, columnFromSocket);
            }
        });

        socket.on('removeBoard', function(data) {
            console.log(data);

            let boardFromSocket = document.getElementById(`board-${data.data.board_id}`);
            if (boardFromSocket !== null) {
                dom.removeBoard(null, boardFromSocket);
            }
        });

        socket.on('addBoard', function(data) {
            let dataParsed = JSON.parse(data.data);
            dom.addNewBoard(dataParsed);
            let addNewBoardButton = document.getElementById('new-board-add-button');
            let boardsContainer = document.querySelector('.board-container');
            boardsContainer.insertAdjacentElement("beforeend", addNewBoardButton);

            dom.updateEventListeners();
        });

        socket.on('addColumn', function(data) {
            let dataParsed = JSON.parse(data.data);
            console.log(dataParsed);

            dom.addNewColumn(dataParsed);
            dom.updateEventListeners();
        });

        socket.on('addCard', function(data) {
            let dataParsed = JSON.parse(data.data);
            console.log(dataParsed);

            dom.addNewCard(dataParsed);
            dragAndDrop.init();
            dom.updateEventListeners();
        });

        socket.on('dragAndDrop', function(data) {
            console.log('Update card order');
            let board = document.querySelector(`#board-${data.data.board_id} .board-columns`);
            board.innerHTML = '';

            console.log(data.data.columns);

            let isPublic = data.data.board_public;
            dom.showColumns(data.data.columns, data.data.board_id, isPublic);

            dragAndDrop.init();
            dom.updateEventListeners();
        });

        socket.on('unarchive', function(data) {
            console.log('Unarchive');
            let json_column = JSON.parse(data.json_column);
            console.log(data);
            console.log(`arch-card-${data.data.card_col_id}-${data.data.card_id}`);
            let card = document.getElementById(`arch-card-${data.data.card_col_id}-${data.data.card_id}`);

            if (card !== null) {
                let input = {
                    card: card,
                    card_col_id: data.data.card_col_id,
                    cards: json_column.cards
                };

                archive.unarchiveCard(null, input);
            }



            // card.remove();
            //
            // let destColumn = document.getElementById(`column-${data.data.card_col_id}`);
            // destColumn.lastElementChild.innerHTML = '';
            // dom.showCards(json_column.cards, data.data.card_col_id);
            // dom.archiveCardAddEventListener();
            //
            // dragAndDrop.init();
            // dom.updateEventListeners();
        });

        socket.on('archive', function(data) {
            console.log('Archive');
            // let json_column = JSON.parse(data.json_column);
            console.log(data);
            console.log(`card-${data.data.card_id}`);
            let card = document.getElementById(`card-${data.data.card_id}`);

            if (card !== null) {
                let input = {
                    card: card,
                    card_col_id: data.data.card_col_id
                };

                dom.archiveCard(null, input);
            }




            // card.remove();

            // dragAndDrop.correctCardOrder(data.data.card_col_id);

            // archive.addAllArchiveCards();
        });
    }
}