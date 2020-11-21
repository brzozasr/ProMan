import {dataHandler} from "./data_handler.js";

export let archive = {
    archiveCard: function (card_id, card_title) {
        return `<div id="arch-card-${card_id}" class="arch-card">${card_title}<img id="unarch-btn-${card_id}" class="arch-unarchive" src="static/img/unarchive.png" alt="^">
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
            for (let key of Object.keys(cardsData.cards_archived)) {
                let card_id = cardsData.cards_archived[key].card_id;
                let card_title = cardsData.cards_archived[key].card_title;

                archive.cardContainer.insertAdjacentHTML('beforeend', archive.archiveCard(card_id, card_title));
            }
        });
    },
};