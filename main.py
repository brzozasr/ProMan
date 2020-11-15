from flask import Flask, render_template, url_for, session, request, jsonify
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


@app.route('/board-change-title', methods=['POST'])
def board_change_title():
    data = request.get_json()
    board_id = data['board_id']
    board_title = data['board_title']

    result = db.execute_sql(query.board_update_board_title, [board_title, board_id])

    if result is None:
        result_dict = {'result': 'Success'}
    else:
        result_dict = {'result': result}

    return jsonify(result_dict)


@app.route('/add-board', methods=['POST'])
def add_board():
    if session.get(SESSION_USER_ID) and session.get(SESSION_USER_LOGIN):
        data = None  # TODO write function get data after sign in
        board_title = None  # TODO
        board_public = False
    else:
        data = request.get_json()
        board_title = data['board_title']
        board_public = True

    result = db.execute_sql(query.board_insert_new_board, [board_title, board_public])
    db.execute_sql(query.col_insert_default_cols, {'board_id': result[0][0]})

    if session.get(SESSION_USER_ID) and session.get(SESSION_USER_LOGIN):
        json_board = None
    else:
        json_board = get_public_board(result[0][0])

    response = app.response_class(
        response=json_board,
        status=200,
        mimetype='application/json'
    )

    return response


@app.route('/add-card', methods=['POST'])
def add_card():
    if session.get(SESSION_USER_ID) and session.get(SESSION_USER_LOGIN):
        data = None  # TODO write function get data after sign in
        card_board_id = None  # TODO
        card_col_id = None  # TODO
        card_title = None  # TODO
    else:
        data = request.get_json()
        card_board_id = data['card_board_id']
        card_col_id = data['card_col_id']
        card_title = data['card_title']

    result = db.execute_sql(query.card_select_max_card_order_in_col, {'col_id': card_col_id})
    db.execute_sql(query.card_insert_new_card, [card_board_id, card_col_id, result[0][0], card_title])

    if session.get(SESSION_USER_ID) and session.get(SESSION_USER_LOGIN):
        json_board = None
    else:
        json_board = get_public_col(card_col_id)

    response = app.response_class(
        response=json_board,
        status=200,
        mimetype='application/json'
    )

    return response


@app.route('/change-card-position/<int:board_id>')
def change_card_position(board_id):
    if session.get(SESSION_USER_ID) and session.get(SESSION_USER_LOGIN):
        cards = None  # TODO write function get data after sign in
    else:
        cards = compare_dict(get_public_board_dict(board_id), request.get_json())

    result = db.execute_multi_sql(query.card_update_card_position, cards)

    if result is None:
        return {'result': 'Success'}
    else:
        return {'result': result}


# @app.route('/test', methods=['GET', 'POST'])
# def test():  # TODO comparison jsons
#     # Convert RealDictRow (psycopg2) to Dictionary
#     dict_db = json.dumps(get_public_board_dict(5))
#     dict_db = json.loads(dict_db)
#
#     dict_js = request.get_json()
#
#     dict_db_col = dict_db.get('columns')
#     dict_js_col = dict_js.get('columns')
#
#     differ_col_list = []
#     i = 0
#     for db_col in dict_db_col:
#         for js_col in dict_js_col:
#             if db_col.get('col_id') == js_col.get('col_id') and db_col != js_col:
#                 differ_col_list.append(i)
#         i += 1
#
#     differ_card_db_list = []
#     differ_card_js_list = []
#     if len(differ_col_list) > 0:
#         for col_id in differ_col_list:
#             differ_card_db_list.extend(dict_db_col[col_id].get('cards'))
#             differ_card_js_list.extend(dict_js_col[col_id].get('cards'))
#
#     # differ_card_db_list.sort(key=get_dict_key)
#     # differ_card_js_list.sort(key=get_dict_key)
#
#     cards_to_change_list = []
#
#     for card_js in differ_card_js_list:
#         for card_db in differ_card_db_list:
#             if card_js.get('card_id') == card_db.get('card_id') and card_js != card_db:
#                 cards_to_change_list.append(card_js)
#
#     # print(json.dumps(cards_to_change_list, indent=2))
#     # print(differ_card_db_list)
#     # print(differ_card_js_list)
#     # print(differ_col_list)
#     # print(type(dict_js_col))
#
#     return dict_js


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
