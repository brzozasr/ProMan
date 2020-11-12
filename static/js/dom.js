// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

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

        let boardList = '';

        for(let board of boards){
            boardList += `
                <section class="board">
                    <div class="board-header">
                        <div class="board-title-container">
                            <span class="board-title">Board ${board.id}</span>
                            <input class="board-title-input" type="text" value="Board ${board.id}" />
                        </div>
                        <div class="board-buttons-container">
                            <button class="board-add">Add Card</button>
                            <button class="board-toggle"><i class="fas fa-chevron-down"></i></button>
                        </div>
                    </div>
                    <div class="board-columns"></div>
                </section>
            `;
        }

        const outerHtml = `
            <ul class="board-container">
                ${boardList}
            </ul>
        `;

        let boardsContainer = document.querySelector('.board-container');
        boardsContainer.insertAdjacentHTML("beforeend", boardList);

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


    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
    },
    // here comes more features

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
    }
};
