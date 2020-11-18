export let dragAndDrop = {
    cache: {},
    boards: {},
    init: function (boards) {
        document.querySelectorAll('.card').forEach(function (card) {
            card.addEventListener('dragstart', dragAndDrop.onDragStartHandler);
        });
        document.querySelectorAll('.card').forEach(function (card) {
            card.addEventListener('dragover', dragAndDrop.onDragOverHandler);
        });
        document.querySelectorAll('.card').forEach(function (card) {
            card.addEventListener('drop', dragAndDrop.onDropHandler);
        });
        // document.querySelectorAll('.card').forEach(function (card) {
        //     card.addEventListener('dragend', dragAndDrop.onDropHandler);
        // });

        this.boards = boards;
    },

    onDragStartHandler: function (e) {
        e.dataTransfer.setData('text/plain', e.target.dataset.cardData);
        dragAndDrop.cache = JSON.parse(e.target.dataset.cardData);
    },

    onDragOverHandler: function (e) {
        e.preventDefault();
        console.log('dragover');


        // let currentCardData = JSON.parse(e.target.dataset.cardData);
        // if (Object.keys(dragAndDrop.cache).length > 0 && Object.keys(currentCardData).length > 0) {
        //
        //     if (dragAndDrop.cache.column_id === currentCardData.column_id) {
        //         if (dragAndDrop.cache.card_id !== currentCardData.card_id) {
        //
        //             let currentElement = document.getElementById(this.id);
        //
        //             let previousElement = currentElement.previousElementSibling;
        //             let nextElement = currentElement.nextElementSibling;
        //
        //             if (dragAndDrop.cache.cardOrder < currentCardData.card_order) {
        //                 // console.log('Insert above');
        //                 // console.log(dragAndDrop.cache);
        //                 // console.log(currentCardData);
        //                 previousElement.insertAdjacentElement('beforebegin', currentElement);
        //
        //             } else if (dragAndDrop.cache.cardOrder > currentCardData.card_order) {
        //                 // console.log('Insert below');
        //                 // console.log(dragAndDrop.cache);
        //                 // console.log(currentCardData);
        //                 nextElement.insertAdjacentElement('afterend', currentElement);
        //             }
        //
        //             dragAndDrop.correctCardOrder(dragAndDrop.cache.column_id);
        //             // dragAndDrop.updateBoardJson(dragAndDrop.cache.board_id);
        //         }
        //     } else {
        //
        //     }
        //
        // }
    },
    onDropHandler: function (e) {
        e.preventDefault();
        console.log('drop');
        let targetCardId = e.target.id.split('-').reverse()[0];
        let targetCardDataSet = JSON.parse(e.target.dataset.cardData);
        let sourceCardId = dragAndDrop.cache.card_id;

        let sourceCard = document.getElementById(`card-${sourceCardId}`);
        let targetCard = document.getElementById(`card-${targetCardId}`);
        
        if (dragAndDrop.cache.column_id === targetCardDataSet.column_id) {
            if (dragAndDrop.cache.card_order < targetCardDataSet.card_order) {
                targetCard.insertAdjacentElement('afterend', sourceCard);
            } else {
                targetCard.insertAdjacentElement('beforebegin', sourceCard);
            }

            dragAndDrop.correctCardOrder(targetCardDataSet.column_id);
        } else {
            targetCard.insertAdjacentElement('afterend', sourceCard);

            dragAndDrop.correctCardOrder(targetCardDataSet.column_id);
            dragAndDrop.correctCardOrder(dragAndDrop.cache.column_id);
        }


        // if (dragAndDrop.cache.board_id === targetCardId) {
        //     targetCard.insertAdjacentElement('afterend', sourceCard);
        // } else {
        //     targetCard.insertAdjacentElement('afterend', sourceCard);
        //
        // }

        // e.preventDefault();
        // let draggedCard = document.getElementById(`card-${dragAndDrop.cache.card_id}`);
        // let currentElement = document.getElementById(this.id);
        // currentElement.insertAdjacentElement('afterend', draggedCard);
        // dragAndDrop.correctCardOrder(dragAndDrop.cache.column_id);

    },
    onDragEndHandler: function () {
        // let cardDataSet = JSON.parse(e.target.dataset.cardData);
        // dragAndDrop.updateBoardJson(cardDataSet.board_id);
    },
    updateColumnId: function () {

    },
    correctCardOrder: function (columnId) {
        let column = document.getElementById(`board-column-content-${columnId}`);
        // console.log(column);
        let cardOrder = 1;
        for (let card of column.children) {
            if (card.className === 'card') {
                // console.log(card);
                let data = JSON.parse(card.dataset.cardData);
                data.card_order = cardOrder;
                data.column_id = columnId;

                card.dataset.cardData = JSON.stringify(data);
            }
            cardOrder++;
        }
    },
    updateBoardJson: function (boardId) {
        for (let board of this.boards.result) {
            if (board.board_id === boardId) {
                for (let column of board.columns) {
                    for (let card of column.cards) {
                        let cardHTML = document.getElementById(`card-${card.card_id}`);
                        let cardDataSet = JSON.parse(cardHTML.dataset.cardData);

                        card.card_col_id = cardDataSet.column_id;
                        card.card_order = cardDataSet.card_order;
                        card.card_title = cardHTML.lastElementChild.firstElementChild.innerText;
                    }
                }
                console.log(board);
                break;
            }
        }
    }
}