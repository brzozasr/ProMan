import { dom } from "./dom.js";


document.addEventListener('DOMContentLoaded', init);
// This function is to initialize the application
function init() {
    // init data
    dom.init();
    // loads the boards to the screen
    dom.loadBoards();


}



