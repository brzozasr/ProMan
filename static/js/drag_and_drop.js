import { dataHandler } from "./data_handler.js";

export let dragAndDrop = {
    cache: {},
    boards: {},
    init: function (boards) {
        document.querySelectorAll('.card').forEach(function (card) {
            card.removeEventListener('dragstart', dragAndDrop.onDragStartHandler);
        });
        document.querySelectorAll('.card').forEach(function (card) {
            card.removeEventListener('dragover', dragAndDrop.onDragOverHandler);
        });
        document.querySelectorAll('.card').forEach(function (card) {
            card.removeEventListener('drop', dragAndDrop.onDropHandler);
        });

        document.querySelectorAll('.card').forEach(function (card) {
            card.addEventListener('dragstart', dragAndDrop.onDragStartHandler);
        });
        document.querySelectorAll('.card').forEach(function (card) {
            card.addEventListener('dragover', dragAndDrop.onDragOverHandler);
        });
        document.querySelectorAll('.card').forEach(function (card) {
            card.addEventListener('drop', dragAndDrop.onDropHandler);
        });

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

        dataHandler.getAllData(function(boards) {
            dragAndDrop.boards = boards;
            dragAndDrop.updateBoardJson(targetCardDataSet.board_id);
        });
    },
    correctCardOrder: function (columnId) {
        let columnContent = document.getElementById(`board-column-content-${columnId}`);
        // console.log(column);
        let card_ids = [];

        let cardOrder = 1;
        for (let card of columnContent.children) {

            if (card.className === 'card') {
                // console.log(card);
                let data = JSON.parse(card.dataset.cardData);
                card_ids.push(data.card_id);

                data.card_order = cardOrder;
                data.column_id = columnId;

                card.dataset.cardData = JSON.stringify(data);
            }
            cardOrder++;
        }

        let column = document.getElementById(`column-${columnId}`);
        let columnDataSet = JSON.parse(column.dataset.columnData);
        columnDataSet.card_ids = [...card_ids];
        column.dataset.columnData = JSON.stringify(columnDataSet);
    },
    updateBoardJson: function (boardId) {
        for (let board of this.boards.result) {
            if (board.board_id === boardId) {

                let cardsToRemove = [];
                for (let column of board.columns) {
                    let columnHTML = document.getElementById(`column-${column.col_id}`);
                    let columnDataSet = JSON.parse(columnHTML.dataset.columnData);
                    // console.log(columnDataSet);

                    let newCards = [];

                    let jsonCardIds = [];
                    for (let cardJson of column.cards) {
                        jsonCardIds.push(cardJson.card_id);
                    }

                    for (let cardId of columnDataSet.card_ids) {
                        if (!jsonCardIds.includes(cardId)) {

                            // console.log(boardId, columnDataSet.col_id, cardId);
                            let newCard = this.getCardFromJson(boardId, cardId);
                            if (newCard === undefined) {
                                console.log(boardId, cardId);
                            }
                            column.cards.push(newCard);
                        }
                    }

                    for (let cardId of jsonCardIds) {
                        if (!columnDataSet.card_ids.includes(cardId)) {
                            // console.log(columnDataSet.card_ids);
                            // console.log(jsonCardIds);
                            // console.log(cardId);
                            // console.log(boardId, columnDataSet.col_id, cardId);
                            let cardDataToRemove = {
                                board_id: boardId,
                                col_id: columnDataSet.col_id,
                                card_id: cardId
                            };
                            cardsToRemove.push(cardDataToRemove);
                            // this.removeCardFromJson(boardId, columnDataSet.col_id, cardId);
                        }
                    }

                    let intersection = jsonCardIds.filter(cardId => {
                        return columnDataSet.card_ids.includes(cardId);
                    });
                    // console.log(column);
                }

                for (let card of cardsToRemove) {
                    this.removeCardFromJson(card.board_id, card.col_id, card.card_id);
                }

                console.log(board.columns);
                for (let column of board.columns) {
                    // for (let cardIndex in column.cards) {
                    for (let cardJson of column.cards) {
                        // console.log(cardJson);
                        let cardHTML = document.getElementById(`card-${cardJson.card_id}`);
                        let cardDataSet = JSON.parse(cardHTML.dataset.cardData);

                        cardJson.card_col_id = cardDataSet.column_id;
                        cardJson.card_order = cardDataSet.card_order;
                        cardJson.card_title = cardHTML.lastElementChild.firstElementChild.innerText;

                    }
                    column.cards.sort(dragAndDrop.sortCards);
                }

                console.log('JSON sent:')
                console.log(board);
                dataHandler.dragAndDrop(board);
                break;
            }
        }
    },
    sortCards: function (card1, card2) {
        return card1.card_order - card2.card_order;
    },
    getCardFromJson: function (boardId, cardId) {
        // console.log(boardId, columnId, cardId);
        for (let board of this.boards.result) {
            // console.log(board);
            if (board.board_id === boardId) {

                for (let column of board.columns) {
                    // console.log(column);
                    for (let card of column.cards) {
                        // console.log(cardId, card);
                        if (card.card_id === cardId) {
                            return card;
                        }
                    }
                }
            }
        }
    },
    removeCardFromJson: function (boardId, columnId, cardId) {
        for (let board of this.boards.result) {
            if (board.board_id === boardId) {
                for (let column of board.columns) {
                    if (column.col_id === columnId) {

                        for (let cardIndex in column.cards) {
                        // for (let card of column.cards) {
                            if (column.cards[cardIndex].card_id === cardId) {
                                column.cards.splice(cardIndex, 1);
                            }
                        }
                    }
                }
            }
        }
    }
}