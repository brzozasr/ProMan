// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
export let dataHandler = {
    _data: {}, // it is a "cache for all data received: boards, cards and statuses. It is not accessed from outside.
    _api_get: function (url, callback) {
        // it is not called from outside
        // loads data from API, parses it and calls the callback with it

        fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        })
        .then(response => response.json())  // parse the response as JSON
        .then(json_response => callback(json_response));  // Call the `callback` with the returned object
    },
    _api_post: function (url, data, callback) {
        // it is not called from outside
        // sends the data to the API, and calls callback function
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(json_response => callback(json_response));
    },
    init: function () {
    },
    getBoards: function (callback) {
        // the boards are retrieved and then the callback function is called with the boards

        // Here we use an arrow function to keep the value of 'this' on dataHandler.
        //    if we would use function(){...} here, the value of 'this' would change.
        this._api_get('/get-boards', (response) => {
            this._data['boards'] = response;
            callback(response);
        });
    },
    getBoard: function (boardId, callback) {
        // the board is retrieved and then the callback function is called with the board
    },
    getStatuses: function (callback) {
        // the statuses are retrieved and then the callback function is called with the statuses
        this._api_get('/get-statuses', (response) => {
            this._data['statuses'] = response;
            callback(response);
        });
    },
    getStatus: function (statusId, callback) {
        // the status is retrieved and then the callback function is called with the status
        this._api_get(`/get-status/${statusId}`, (response) => {
            this._data[`status_${statusId}`] = response;
            callback(response);
        });
    },
    getCardsByBoardId: function (boardId, callback) {
        // the cards are retrieved and then the callback function is called with the cards
        this._api_get(`/get-cards/${boardId}`, (response) => {
            this._data[`boardCards_${boardId}`] = response;
            callback(response);
        });
    },
    getAllData: function (callback) {
        this._api_get(`/get-all-data`, (response) => {
            this._data[`allData`] = response;
            callback(response);
        });
    },
    updateBoardName: function (boardName) {
        this._api_post(`/board-change-title`, boardName, (response) => {
            // this._data[`allData`] = response;
            // callback(response);
        });
    },
    getCard: function (cardId, callback) {
        // the card is retrieved and then the callback function is called with the card
    },
    createNewBoard: function (boardTitle, callback) {
        // creates new board, saves it and calls the callback function with its data
        this._api_post(`/add-board`, boardTitle, (response) => {
            // this._data[`allData`] = response;
            callback(response);
        });
    },
    createNewCard: function (newCardData, callback) {
        this._api_post(`/add-card`, newCardData, (response) => {
            // this._data[`allData`] = response;
            callback(response);
            console.log(response);
        });
    },
    createNewColumn: function (newColumnData, callback) {
        this._api_post(`/add-column`, newColumnData, (response) => {
            // this._data[`allData`] = response;
            callback(response);
            console.log(response);
        });
    },
    removeCard: function (cardData) {
        this._api_post(`/delete-card`, cardData, (response) => {
            // this._data[`allData`] = response;
            // callback(response);
            console.log(response);
        });
    },
    removeColumn: function (columnData) {
        this._api_post(`/delete-column`, columnData, (response) => {
            // this._data[`allData`] = response;
            // callback(response);
            console.log(response);
        });
    },
    removeBoard: function (boardData) {
        this._api_post(`/delete-board`, boardData, (response) => {
            // this._data[`allData`] = response;
            // callback(response);
            console.log(response);
        });
    },
    loginUser: function (userData, callback) {
        this._api_post(`/user-login`, userData, (response) => {
            // this._data[`allData`] = response;
            callback(response);
            console.log(response);
        });
    },
    registerUser: function (userData, callback) {
        this._api_post(`/user-register`, userData, (response) => {
            // this._data[`allData`] = response;
            callback(response);
            console.log(response);
        });
    },
    isUserLogin: function (isLogin, callback) {
        this._api_post(`/is-user-login`, isLogin, (response) => {
            // this._data[`allData`] = response;
            callback(response);
            console.log(response);
        });
    },
    userLogout: function (userData, callback) {
        this._api_post(`/user-logout`, userData, (response) => {
            // this._data[`allData`] = response;
            callback(response);
            console.log(response);
        });
    },
    _createNewCard: function (cardTitle, boardId, statusId, callback) {
        // creates new card, saves it and calls the callback function with its data
    },
    updateData: function (elementType, data) {
        switch (elementType) {
            case 'addCard':
                for (let board of this._data.result) {
                    if (board.board_id === elementType.card_board_id) {
                        for (let column of board.columns) {
                            if (column.col_id === elementType.card_col_id) {
                                column.cards.push(elementType);
                                break;
                            }
                        }
                        break;
                    }
                }
        }
    }
    // here comes more features
};
