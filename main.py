import bcrypt
from flask import Flask, render_template, url_for, session, request, jsonify
from flask_socketio import SocketIO

import data_handler
from json_data import *
from util import json_response
from utils import *

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.secret_key = SESSION_SECRET_KEY
socketio = SocketIO(app)


@app.context_processor
def inject_global():
    return dict(user_id=SESSION_USER_ID, user_login=SESSION_USER_LOGIN)


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


@app.route('/column-change-title', methods=['POST'])
def column_change_title():
    data = request.get_json()
    col_board_id = data['col_board_id']
    col_title = data['col_title']

    result = db.execute_sql(query.col_update_col_title, [col_title, col_board_id])

    if result is None:
        result_dict = {'result': 'Success'}
    else:
        result_dict = {'result': result}

    return jsonify(result_dict)


@app.route('/card-change-title', methods=['POST'])
def card_change_title():
    data = request.get_json()
    card_id = data['card_id']
    card_title = data['card_title']

    result = db.execute_sql(query.card_update_card_title, [card_title, card_id])

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
    if result:
        card_order = result[0][0] + 1
    else:
        card_order = 1

    db.execute_sql(query.card_insert_new_card, [card_board_id, card_col_id, card_order, card_title])

    if session.get(SESSION_USER_ID) and session.get(SESSION_USER_LOGIN):
        json_col = None
    else:
        json_col = get_public_col(card_col_id)

    response = app.response_class(
        response=json_col,
        status=200,
        mimetype='application/json'
    )

    return response


@app.route('/add-column', methods=['POST'])
def add_column():
    if session.get(SESSION_USER_ID) and session.get(SESSION_USER_LOGIN):
        data = None  # TODO write function get data after sign in
        col_board_id = None  # TODO
        col_title = None  # TODO
    else:
        data = request.get_json()
        col_board_id = data['col_board_id']
        col_title = data['col_title']

    db.execute_sql(query.col_insert_new_col, [col_board_id, col_title])

    if session.get(SESSION_USER_ID) and session.get(SESSION_USER_LOGIN):
        json_board = None
    else:
        json_board = get_public_board(col_board_id)

    response = app.response_class(
        response=json_board,
        status=200,
        mimetype='application/json'
    )

    return response


@app.route('/delete-board', methods=['POST'])
def delete_board():
    if session.get(SESSION_USER_ID) and session.get(SESSION_USER_LOGIN):
        data = None  # TODO write function get data after sign in
        board_id = None  # TODO
    else:
        data = request.get_json()
        board_id = data['board_id']

    db.execute_sql(query.board_delete_by_id_board, [board_id])

    if session.get(SESSION_USER_ID) and session.get(SESSION_USER_LOGIN):
        json_boards = None  # TODO
    else:
        json_boards = get_all_public_data()

    response = app.response_class(
        response=json_boards,
        status=200,
        mimetype='application/json'
    )

    return response


@app.route('/delete-column', methods=['POST'])
def delete_column():
    if session.get(SESSION_USER_ID) and session.get(SESSION_USER_LOGIN):
        data = None  # TODO write function get data after sign in
        col_id = None  # TODO
        col_board_id = None  # TODO
    else:
        data = request.get_json()
        col_id = data['col_id']
        col_board_id = data['col_board_id']

    db.execute_sql(query.col_delete_by_col_id, [col_id])

    if session.get(SESSION_USER_ID) and session.get(SESSION_USER_LOGIN):
        json_board = None  # TODO
    else:
        json_board = get_public_board(col_board_id)

    response = app.response_class(
        response=json_board,
        status=200,
        mimetype='application/json'
    )

    return response


@app.route('/delete-card', methods=['POST'])
def delete_card():
    if session.get(SESSION_USER_ID) and session.get(SESSION_USER_LOGIN):
        data = None  # TODO write function get data after sign in
        card_id = None  # TODO
        card_col_id = None  # TODO
    else:
        data = request.get_json()
        card_id = data['card_id']
        card_col_id = data['card_col_id']

    db.execute_sql(query.card_delete_by_card_id, [card_id])

    cards_order = db.execute_sql(query.card_select_by_card_col_id, [card_col_id])  # card_col_id
    cards_list = set_card_order(cards_order)

    if cards_list:
        db.execute_multi_sql(query.card_update_card_order_by_card_id, cards_list)

    if session.get(SESSION_USER_ID) and session.get(SESSION_USER_LOGIN):
        json_column = None  # TODO
    else:
        json_column = get_public_col(card_col_id)  # card_col_id

    response = app.response_class(
        response=json_column,
        status=200,
        mimetype='application/json'
    )

    return response


@app.route('/archive-card', methods=['POST'])
def archive_card():
    if session.get(SESSION_USER_ID) and session.get(SESSION_USER_LOGIN):
        data = None  # TODO write function get data after sign in
        card_id = None  # TODO
        card_col_id = None  # TODO
    else:
        data = request.get_json()
        card_id = data['card_id']
        card_col_id = data['card_col_id']

    db.execute_sql(query.card_update_card_archive, [card_id])

    cards_order = db.execute_sql(query.card_select_by_card_col_id, [card_col_id])  # card_col_id
    cards_list = set_card_order(cards_order)

    if cards_list:
        db.execute_multi_sql(query.card_update_card_order_by_card_id, cards_list)

    if session.get(SESSION_USER_ID) and session.get(SESSION_USER_LOGIN):
        json_column = None  # TODO
    else:
        json_column = get_public_col(card_col_id)  # card_col_id

    response = app.response_class(
        response=json_column,
        status=200,
        mimetype='application/json'
    )

    return response


@app.route('/unarchive-card', methods=['POST'])
def unarchive_card():
    if session.get(SESSION_USER_ID) and session.get(SESSION_USER_LOGIN):
        data = None  # TODO write function get data after sign in
        card_id = None  # TODO
        card_col_id = None  # TODO
    else:
        data = request.get_json()
        card_id = data['card_id']
        card_col_id = data['card_col_id']

    result = db.execute_sql(query.card_select_max_card_order_in_col, {'col_id': card_col_id})
    if result:
        card_order = result[0][0] + 1
    else:
        card_order = 1

    db.execute_sql(query.card_update_card_unarchive, [card_order, card_id])

    if session.get(SESSION_USER_ID) and session.get(SESSION_USER_LOGIN):
        json_column = None  # TODO
    else:
        json_column = get_public_col(card_col_id)  # card_col_id

    response = app.response_class(
        response=json_column,
        status=200,
        mimetype='application/json'
    )

    return response


@app.route('/change-card-position', methods=['POST'])
def change_card_position():
    if session.get(SESSION_USER_ID) and session.get(SESSION_USER_LOGIN):
        data = None  # TODO
        board_id = None  # TODO
        cards = None  # TODO write function get data after sign in
    else:
        data = request.get_json()
        board_id = data['board_id']
        cards = compare_dict(get_public_board_dict(board_id), data)

        print(cards)

    result = db.execute_multi_sql(query.card_update_card_position, cards)

    if result is None:
        return {'result': 'Success'}
    else:
        return {'result': result}


@app.route('/user-login', methods=['POST'])
def user_login():
    data = request.get_json()
    users_login = data['users_login']
    users_pass = data['users_pass']

    log_data = db.execute_sql(query.users_select_by_users_login, [users_login])

    if log_data and type(log_data) == list and len(log_data) == 1:
        user_data = {}
        dict_key = [SESSION_USER_ID, SESSION_USER_LOGIN, 'users_pass']
        i = 0
        for data in log_data[0]:
            user_data[dict_key[i]] = data
            i += 1
        if users_login == user_data[SESSION_USER_LOGIN] and \
                bcrypt.checkpw(users_pass.encode('utf-8'), user_data['users_pass'].encode('utf-8')):
            session[SESSION_USER_ID] = user_data[SESSION_USER_ID]
            session[SESSION_USER_LOGIN] = user_data[SESSION_USER_LOGIN]
            result = jsonify({
                'login': 'Success',
                'error': None,
                'users_login': users_login
            })
        else:
            result = jsonify({
                'login': 'Failure',
                'error': 'Invalid email address or password!',
                'users_login': None
            })
    else:
        if type(log_data) == list:
            result = jsonify({
                'login': 'Failure',
                'error': 'Invalid email address or password!',
                'users_login': None
            })
        else:
            result = jsonify({
                'login': 'Failure',
                'error': str(log_data),
                'users_login': None
            })

    return result


@app.route('/user-register', methods=['POST'])
def user_register():
    data = request.get_json()
    users_login = data['users_login']
    users_pass = data['users_pass']

    pass_hash = bcrypt.hashpw(users_pass.encode('utf-8'), bcrypt.gensalt())
    error = db.execute_sql(query.users_insert_new_user, [users_login, pass_hash.decode('utf-8')])

    if error:
        result = jsonify({
            'register': 'Failure',
            'error': str(error)
        })
    else:
        result = jsonify({
            'register': 'Success',
            'error': None
        })

    return result


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
    # app.run(debug=True)
    socketio.run(app)
    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
