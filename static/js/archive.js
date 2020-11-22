import {dataHandler} from "./data_handler.js";
import {dom} from "./dom.js";
import {dragAndDrop} from "./drag_and_drop.js";

export let archive = {
    archiveCard: function (card_id, card_title, col_id) {
        return `<div id="arch-card-${col_id}-${card_id}" class="arch-card">${card_title}<img id="unarch-btn-${card_id}" class="arch-unarchive" src="static/img/unarchive.png" alt="^">
        </div>`;
    },

    archiveTitle: `
        <div class="arch-card-title">
            Archived Cards
        </div>
    `,

    mainDiv: document.getElementById('arch-main'),

    cardContainer: document.getElementById('arch-container'),

    moveButton: document.getElementById('arch-move'),

    moveButtonAddListener: function () {
        archive.moveButton.addEventListener('click', this.hidSowArchive);
    },

    unarchiveAddEventListeners: function () {
        let unarchiveButtons = document.querySelectorAll('.arch-unarchive');

        for (let button of unarchiveButtons) {
            button.removeEventListener('click', archive.unarchiveCard);
            button.addEventListener('click', archive.unarchiveCard);
        }
    },

    unarchiveCard: function (e, input=null) {
        if (input === null) {
            dom.isUnarchiving = true;
            let card = e.currentTarget.parentElement;

            let [card_id, card_col_id] = card.id.split('-').reverse();
            console.log(card.id);
            console.log(`column-${card_col_id}`);

            let column = document.getElementById(`column-${card_col_id}`);
            let columnDataSet = JSON.parse(column.dataset.columnData);

            let cardData = {
                card_id: card_id,
                card_col_id: card_col_id,
                board_public: columnDataSet.isPublic
            };

            dataHandler.unarchiveCard(cardData, function (column) {
                card.remove();

                let destColumn = document.getElementById(`column-${card_col_id}`);
                let destColumnDataSet = JSON.parse(destColumn.dataset.columnData);
                destColumn.lastElementChild.innerHTML = '';
                dom.showCards(column.cards, card_col_id);
                dom.newCardAddButton(card_col_id, destColumnDataSet.col_board_id);
                dom.archiveCardAddEventListener();

                dragAndDrop.init();
                dom.updateEventListeners();

                dom.isUnarchiving = false;
            });
        } else if (!dom.isUnarchiving) {
            input.card.remove();
            let destColumn = document.getElementById(`column-${input.card_col_id}`);
            let destColumnDataSet = JSON.parse(destColumn.dataset.columnData);
            destColumn.lastElementChild.innerHTML = '';
            dom.showCards(input.cards, input.card_col_id);
            dom.newCardAddButton(input.card_col_id, destColumnDataSet.col_board_id);
            dom.archiveCardAddEventListener();
            dom.archiveCardAddEventListener();

            dragAndDrop.init();
            dom.updateEventListeners();
        }

    },

    hidSowArchive: function () {
        let classMain = archive.mainDiv.className;
        if (classMain === 'arch-main-hide') {
            archive.moveButton.removeAttribute('src');
            archive.moveButton.removeAttribute('alt');
            archive.moveButton.setAttribute('src', 'static/img/right.png');
            archive.moveButton.setAttribute('alt', '>>');
            archive.mainDiv.classList.remove('arch-main-hide');
            archive.mainDiv.classList.add('arch-main-show');
        } else if (classMain === 'arch-main-show') {
            archive.moveButton.removeAttribute('src');
            archive.moveButton.removeAttribute('alt');
            archive.moveButton.setAttribute('src', 'static/img/left.png');
            archive.moveButton.setAttribute('alt', '<<');
            archive.mainDiv.classList.remove('arch-main-show');
            archive.mainDiv.classList.add('arch-main-hide')
        }
    },

    initArchivedCards: function () {
        archive.moveButtonAddListener();
        archive.addAllArchiveCards();
    },

    addAllArchiveCards: function () {
        archive.cardContainer.innerHTML = '';
        archive.cardContainer.insertAdjacentHTML('afterbegin', archive.archiveTitle)
        dataHandler.getArchiveCards( function (cardsData) {
            console.log('cardsData');
            console.log(cardsData);
            for (let key of Object.keys(cardsData.cards_archived)) {
                let card_id = cardsData.cards_archived[key].card_id;
                let card_title = cardsData.cards_archived[key].card_title;
                let col_id = cardsData.cards_archived[key].card_col_id;

                // console.log(archive.archiveCard(card_id, card_title, col_id));
                archive.cardContainer.insertAdjacentHTML('beforeend', archive.archiveCard(card_id, card_title, col_id));

            }

            console.log(archive.cardContainer);
            archive.unarchiveAddEventListeners();
        });
    },
};