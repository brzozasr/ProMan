import { dom } from "./dom.js";

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
    }
}