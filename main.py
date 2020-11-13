from flask import Flask, render_template, url_for, session
from util import json_response
from json_data import *

import data_handler

app = Flask(__name__)


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/get-all-data")
def get_all_data():
    """All the boards, the columns and the cards as a JSON."""
    if session.get(SESSION_USER_ID) and session.get(SESSION_USER_LOGIN):
        data = None  # TODO write function get data after sign in
    else:
        data = get_all_public_data()

    response = app.response_class(
        response=data,
        status=200,
        mimetype='application/json'
    )
    return response


@app.route("/get-boards")
def get_boards():
    """All the boards as a JSON"""
    if session.get(SESSION_USER_ID) and session.get(SESSION_USER_LOGIN):
        data = None  # TODO write function get data after sign in
    else:
        data = get_public_boards()

    response = app.response_class(
        response=data,
        status=200,
        mimetype='application/json'
    )
    return response


@app.route("/get-boardss")
@json_response
def get_boardss():
    """
    All the boards
    """
    return data_handler.get_boards()


@app.route("/get-board/<int:board_id>")
def get_board(board_id):
    """Get the board by ID and returns as a JSON
    with the columns and the cards."""
    if session.get(SESSION_USER_ID) and session.get(SESSION_USER_LOGIN):
        data = None  # TODO write function get data after sign in
    else:
        data = get_public_board(board_id)

    response = app.response_class(
        response=data,
        status=200,
        mimetype='application/json'
    )
    return response


@app.route("/get-column/<int:col_id>")
def get_column(col_id):
    """Get the board by ID and returns as a JSON
    with the columns and the cards."""
    if session.get(SESSION_USER_ID) and session.get(SESSION_USER_LOGIN):
        data = None  # TODO write function get data after sign in
    else:
        data = get_public_col(col_id)

    response = app.response_class(
        response=data,
        status=200,
        mimetype='application/json'
    )
    return response


@app.route("/get-card/<int:card_id>")
def get_card(card_id):
    """Get the card by ID and returns as a JSON."""
    if session.get(SESSION_USER_ID) and session.get(SESSION_USER_LOGIN):
        data = None  # TODO write function get data after sign in
    else:
        data = get_public_card(card_id)

    response = app.response_class(
        response=data,
        status=200,
        mimetype='application/json'
    )
    return response


@app.route("/get-status/<int:status_id>")
@json_response
def get_status(status_id):
    """
    Return the status name by status id
    """
    return data_handler.get_card_status(status_id)


@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return data_handler.get_cards_for_board(board_id)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
