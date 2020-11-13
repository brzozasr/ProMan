export let boardHiding = {
    toggleButtons: document.querySelectorAll('.board-toggle'),

    boards: document.querySelectorAll('.board-columns'),

    addButtons: document.querySelectorAll('.board-add'),

    chevronsAddListener: function() {
        this.toggleButtons = document.querySelectorAll('.board-toggle');

        this.boards = document.querySelectorAll('.board-columns');

        this.addButtons = document.querySelectorAll('.board-add');

        let i = 0;

        this.toggleButtons.forEach(chevronButton => {
            chevronButton.removeEventListener('click', boardHiding.showBoard);
            chevronButton.removeEventListener('click', boardHiding.hideBoard);

            if (!this.boards[i].hasAttribute('style')) {
                // console.log(`${this.boards[i].getAttribute('id')} Has style: ${this.boards[i].getAttribute('style')} so add eventListener: hideBoard`)
                chevronButton.addEventListener("click", boardHiding.hideBoard);
            } else {
                // console.log(`${this.boards[i].getAttribute('id')} Has style: ${this.boards[i].getAttribute('style')} so add eventListener: showBoard`)
                chevronButton.addEventListener("click", boardHiding.showBoard);
            }
            i++;
        });
    },

    showBoard: function(e) {
        // console.log('show');
        boardHiding.hideAllBoards();
        let chevronButtonParent = e.currentTarget.parentElement;
        let boardHeaderParent = chevronButtonParent.parentElement.parentElement;

        let boardId = e.currentTarget.getAttribute('id').slice(-1)[0];
        let boardColumns = document.getElementById(`board-columns-${boardId}`);


        // console.log(`${boardColumns.getAttribute('id')} style before: ${boardColumns.getAttribute('style')}`);
        if (boardColumns.hasAttribute('style')) {
            boardColumns.removeAttribute('style');
        }
        // console.log(`${boardColumns.getAttribute('id')} style after: ${boardColumns.getAttribute('style')}`);

        let addButton = e.currentTarget.previousElementSibling;
        if (addButton.hasAttribute('style')) {
            addButton.removeAttribute('style');
        }

        let j = 0;
        boardHiding.toggleButtons.forEach(chevronButton => {
            if (!boardHiding.boards[j].hasAttribute('style')) {
                let chevron = chevronButton.childNodes;
                chevron[0].classList.value = '';
                chevron[0].classList.add('fas');
                chevron[0].classList.add('fa-chevron-up');
            }
            j++;

            chevronButton.removeEventListener('click', boardHiding.showBoard);
            chevronButton.removeEventListener('click', boardHiding.hideBoard);
        });

        // console.log(`style: ${boardColumns.getAttribute('style')}`);

        boardHiding.chevronsAddListener();
    },

    hideBoard: function(e) {
        // console.log('hide');
        let chevronButtonParent = e.currentTarget.parentElement;
        let boardHeaderParent = chevronButtonParent.parentElement.parentElement;
        let board = boardHeaderParent.querySelectorAll('.board-columns');

        if (!board[0].hasAttribute('style')) {
            board[0].style.display = 'none';
        }

        let i = 0;
        boardHiding.addButtons.forEach(addButton => {
            if (boardHiding.boards[i].hasAttribute('style')) {
                addButton.style.visibility = 'hidden';
            }
            i++;
        });

        let j = 0;
        boardHiding.toggleButtons.forEach(chevronButton => {
            if (boardHiding.boards[j].hasAttribute('style')) {
                let chevron = chevronButton.childNodes;
                chevron[0].classList.value = '';
                chevron[0].classList.add('fas');
                chevron[0].classList.add('fa-chevron-down');
            }
            j++;

            chevronButton.removeEventListener('click', boardHiding.hideBoard);
            chevronButton.removeEventListener('click', boardHiding.showBoard);
        });

        boardHiding.chevronsAddListener();
    },

    hideAllBoards: function() {
        this.boards.forEach(board => {
            board.style.display = 'none';
        });

        this.addButtons.forEach(addButton => {
            addButton.style.visibility = 'hidden';
        });

        this.toggleButtons.forEach(chevronButton => {

            let chevron = chevronButton.childNodes;
            chevron[0].classList.value = '';
            chevron[0].classList.add('fas');
            chevron[0].classList.add('fa-chevron-down');

            chevronButton.removeEventListener('click', this.hideBoard);
            chevronButton.removeEventListener('click', this.showBoard);
        });
    },
}