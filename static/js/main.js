import { dom } from "./dom.js";

// This function is to initialize the application
function init() {
    document.addEventListener('keydown', e => {
        switch (e.key) {
            case "Enter":
                let boardInputs = document.querySelectorAll('.board-title-input');
                console.log(boardInputs);
                for (let boardInput of boardInputs) {
                    if (boardInput.style.display == 'inline') {
                        boardInput.previousElementSibling.style.display = 'inline-block';
                        boardInput.previousElementSibling.innerText = boardInput.value;
                        boardInput.style.display = 'none';
                    }
                }
                break;
        }
    });
    // init data
    dom.init();
    // loads the boards to the screen
    dom.loadBoards();


}

init();
