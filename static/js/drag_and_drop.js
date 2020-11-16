export let dragAndDrop = {
    cache: {},
    init: function () {
        document.querySelectorAll('.card').forEach(function (card) {
            card.addEventListener('dragstart', dragAndDrop.onDragStartHandler);
        });
        document.querySelectorAll('.card').forEach(function (card) {
            card.addEventListener('dragover', dragAndDrop.onDragOverHandler);
        });
        document.querySelectorAll('.card').forEach(function (card) {
            card.addEventListener('drop', dragAndDrop.onDropHandler);
        });
    },

    onDragStartHandler: function (e) {
        e.dataTransfer.setData('text/plain', e.target.dataset.cardData);
        dragAndDrop.cache = JSON.parse(e.target.dataset.cardData);
    },

    onDragOverHandler: function (e) {
        let currentCardData = JSON.parse(e.target.dataset.cardData);
        if (Object.keys(dragAndDrop.cache).length > 0 && Object.keys(currentCardData).length > 0) {

            if (dragAndDrop.cache.columnId === currentCardData.columnId) {
                if (dragAndDrop.cache.cardId !== currentCardData.cardId) {

                    let currentElement = document.getElementById(this.id);

                    let previousElement = currentElement.previousElementSibling;
                    let nextElement = currentElement.nextElementSibling;

                    if (dragAndDrop.cache.cardOrder < currentCardData.cardOrder) {
                        // console.log('ok');
                        previousElement.insertAdjacentElement('beforebegin', currentElement);

                    } else {
                        nextElement.insertAdjacentElement('afterend', currentElement);
                    }

                    dragAndDrop.correctCardOrder(dragAndDrop.cache.columnId);
                }
            } else {

            }

        }
    },
    onDropHandler: function (e) {
        e.preventDefault();
    },
    updateColumnId: function () {

    },
    correctCardOrder: function (columnId) {
        let column = document.getElementById(`board-column-content-${columnId}`);
        let cardOrder = 1;
        for (let card of column.children) {
            if (card.className === 'card') {
                // console.log(card);
                let data = JSON.parse(card.dataset.cardData);
                data.cardOrder = cardOrder;
                card.dataset.cardData = JSON.stringify(data);
            }
            cardOrder++;
        }
    }
}