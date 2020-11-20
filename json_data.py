import json

from database_tools import *
from query import *


def __get_public_boards():
    """Returns all public boards from DB."""
    return db.execute_sql_dict(query.board_select_public)


def __get_public_private_boards(user_id):
    """Returns all public and private boards for the user from DB."""
    return db.execute_sql_dict(query.board_select_public_private, [user_id])


def __get_public_columns():
    """Returns all public columns from DB."""
    return db.execute_sql_dict(query.col_select_public)


def __get_public_private_columns(user_id):
    """Returns all public and private columns for the user from DB."""
    return db.execute_sql_dict(query.col_select_public_private, [user_id])


def __get_public_cards():
    """Returns all public cards from DB."""
    return db.execute_sql_dict(query.card_select_public)


def __get_public_private_cards(user_id):
    """Returns all public and private cards for the user from DB."""
    return db.execute_sql_dict(query.card_select_public_private, user_id)


def __get_public_board_by_board_id(board_id):
    """Returns the public bord from DB selected by board ID."""
    return db.execute_sql_dict(query.board_select_public_by_board_id, [board_id])


def __get_public_private_board_by_board_id(user_id, board_id):
    """Returns the public and private bord for the user from DB selected by board ID."""
    return db.execute_sql_dict(query.board_select_public_private_by_board_id, [user_id, board_id, board_id])


def __get_public_columns_by_board_id(board_id):
    """Returns the public columns from DB selected by board ID."""
    return db.execute_sql_dict(query.col_select_public_by_col_board_id, [board_id])


def __get_public_private_columns_by_board_id(board_id):
    """Returns the public and private columns from DB selected by board ID."""
    return db.execute_sql_dict(query.col_select_public_private_by_col_board_id, [board_id])


def __get_public_cards_by_board_id(board_id):
    """Returns the public cards from DB selected by board ID."""
    return db.execute_sql_dict(query.card_select_public_by_card_board_id, [board_id])


def __get_public_private_cards_by_board_id(board_id):
    """Returns the public and private cards from DB selected by board ID."""
    return db.execute_sql_dict(query.card_select_public_private_by_card_board_id, [board_id])


def __get_public_column_by_col_id(col_id):
    """Returns the public card from DB selected by column ID."""
    return db.execute_sql_dict(query.col_select_public_by_col_id, [col_id])


def __get_public_private_column_by_col_id(col_id):
    """Returns the public and private card from DB selected by column ID."""
    return db.execute_sql_dict(query.col_select_public_private_by_col_id, [col_id])


def __get_public_cards_by_col_id(col_id):
    """Returns the public cards from DB selected by column ID."""
    return db.execute_sql_dict(query.card_select_public_by_card_col_id, [col_id])


def __get_public_private_cards_by_col_id(col_id):
    """Returns the public and private cards from DB selected by column ID."""
    return db.execute_sql_dict(query.card_select_public_private_by_card_col_id, [col_id])


def __get_public_card_by_card_id(card_id):
    """Returns the public cards from DB selected by column ID."""
    return db.execute_sql_dict(query.card_select_public_by_card_id, [card_id])


def __get_public_private_card_by_card_id(card_id):
    """Returns the public and private cards from DB selected by column ID."""
    return db.execute_sql_dict(query.card_select_public_private_by_card_id, [card_id])


def __dict_date_to_str(real_dict, dict_key):
    """Converts date format to string from given RealDict."""
    if len(real_dict) > 0:
        result_list = []
        for row in real_dict:
            row[dict_key] = str(row[dict_key])
            result_list.append(row)
        return result_list
    else:
        return None


def __get_data(boards, columns, cards, return_json=True):
    """Return JSON or Dictionary depends on flag "json".
    Return all data from the database tables: board, col, card."""
    result_dict = {}
    result_dict.update({'count_boards': len(boards)})
    result_dict.update({'result': []})
    boards = __dict_date_to_str(boards, 'board_registration')
    columns = __dict_date_to_str(columns, 'col_registration')
    cards = __dict_date_to_str(cards, 'card_registration')
    tmp_dict = {}

    if boards is not None:
        for row in boards:
            for k, v in row.items():
                tmp_dict[k] = v
            result_dict['result'].append(tmp_dict.copy())
            tmp_dict.clear()
    else:
        return None

    for i in range(len(result_dict['result'])):
        result_dict['result'][i]['columns'] = []

    tmp_list_col = []
    if columns is not None:
        for row in columns:
            for k, v in row.items():
                tmp_dict[k] = v
            tmp_list_col.append(tmp_dict.copy())
            tmp_dict.clear()

    for i in range(len(result_dict['result'])):
        for col in tmp_list_col:
            if result_dict['result'][i]['board_id'] == col['col_board_id']:
                result_dict['result'][i]['columns'].append(col)

    for i in range(len(result_dict['result'])):
        for j in range(len(result_dict['result'][i]['columns'])):
            result_dict['result'][i]['columns'][j]['cards'] = []

    tmp_list_cards = []
    if cards is not None:
        for row in cards:
            for k, v in row.items():
                tmp_dict[k] = v
            tmp_list_cards.append(tmp_dict.copy())
            tmp_dict.clear()

    for i in range(len(result_dict['result'])):
        for j in range(len(result_dict['result'][i]['columns'])):
            for card in tmp_list_cards:
                if result_dict['result'][i]['columns'][j]['col_id'] == card['card_col_id'] and \
                        result_dict['result'][i]['columns'][j]['col_board_id'] == card['card_board_id']:
                    result_dict['result'][i]['columns'][j]['cards'].append(card)

    if return_json:
        return json.dumps(result_dict, indent=4)
    else:
        return result_dict


def __get_boards(boards, columns, return_json=True):
    """Return JSON or Dictionary depends on flag "json".
        Return data from the database table: board."""
    result_dict = {}
    result_dict.update({'count_boards': len(boards)})
    result_dict.update({'result': []})
    boards = __dict_date_to_str(boards, 'board_registration')

    tmp_dict = {}
    if boards is not None:
        for row in boards:
            for k, v in row.items():
                tmp_dict[k] = v
            result_dict['result'].append(tmp_dict.copy())
            tmp_dict.clear()
    else:
        return None

    tmp_count_col = []
    if boards is not None:
        for b_row in boards:
            tmp_counter = 0
            for c_row in columns:
                if b_row['board_id'] == c_row['col_board_id']:
                    tmp_counter += 1
            tmp_count_col.append(tmp_counter)

    for i in range(len(result_dict['result'])):
        result_dict['result'][i]['count_columns'] = tmp_count_col[i]

    if return_json:
        return json.dumps(result_dict, indent=4)
    else:
        return result_dict


def __get_board(board, columns, cards, return_json=True):
    """Return JSON or Dictionary depends on flag "return_json".
    Return one board selected by ID and the columns and cards that belongs to the board."""
    board = __dict_date_to_str(board, 'board_registration')
    columns = __dict_date_to_str(columns, 'col_registration')
    cards = __dict_date_to_str(cards, 'card_registration')

    if board is not None:
        result_dict = board[0]
    else:
        return None

    result_dict.update({'columns': []})

    if columns is not None:
        for row in columns:
            result_dict['columns'].append(row)

    for i in range(len(result_dict['columns'])):
        result_dict['columns'][i]['cards'] = []

    tmp_list_cards = []
    tmp_dict = {}
    if cards is not None:
        for row in cards:
            for k, v in row.items():
                tmp_dict[k] = v
            tmp_list_cards.append(tmp_dict.copy())
            tmp_dict.clear()

    for i in range(len(result_dict['columns'])):
        for card in tmp_list_cards:
            if result_dict['columns'][i]['col_id'] == card['card_col_id'] and \
                    result_dict['columns'][i]['col_board_id'] == card['card_board_id']:
                result_dict['columns'][i]['cards'].append(card)

    if return_json:
        return json.dumps(result_dict, indent=4)
    else:
        return result_dict


def __get_column(column, cards, return_json=True):
    """Return JSON or Dictionary depends on flag "return_json".
    Return one column selected by ID and the cards that belongs to the column."""
    column = __dict_date_to_str(column, 'col_registration')
    cards = __dict_date_to_str(cards, 'card_registration')

    if column is not None:
        result_dict = column[0]
    else:
        return None

    result_dict.update({'cards': []})

    if cards is not None:
        for row in cards:
            result_dict['cards'].append(row)

    if return_json:
        return json.dumps(result_dict, indent=4)
    else:
        return result_dict


def __get_card(card, return_json=True):
    """Return JSON or Dictionary depends on flag "return_json".
    Return one card selected by ID."""
    card = __dict_date_to_str(card, 'card_registration')

    if card is not None:
        result_dict = card[0]
    else:
        return None

    if return_json:
        return json.dumps(result_dict, indent=4)
    else:
        return result_dict


def __get_dict_key(dict_key):
    return dict_key['card_id']


def compare_dict(dict_db, dict_js, return_json=False):
    """The function compares two Dictionaries to find differences in the cards:
    :param dict_db: as argument set function get_public_board_dict(board_id),
    :param dict_js: as argument set request.get_json(),
    :param return_json: the flag for returning, if equals False returns JSON else Dictionary.
    :returns: the list of dictionary (with the cards) or JSON."""

    # Convert RealDictRow (psycopg2) to Dictionary
    dict_db = json.dumps(dict_db)
    dict_db = json.loads(dict_db)

    dict_db_col = dict_db.get('columns')
    dict_js_col = dict_js.get('columns')

    differ_col_list = []
    i = 0
    for db_col in dict_db_col:
        for js_col in dict_js_col:
            if db_col.get('col_id') == js_col.get('col_id') and db_col != js_col:
                differ_col_list.append(i)
        i += 1

    differ_card_db_list = []
    differ_card_js_list = []
    if len(differ_col_list) > 0:
        for col_id in differ_col_list:
            differ_card_db_list.extend(dict_db_col[col_id].get('cards'))
            differ_card_js_list.extend(dict_js_col[col_id].get('cards'))

    # differ_card_db_list.sort(key=__get_dict_key)
    # differ_card_js_list.sort(key=__get_dict_key)

    cards_to_change_list = []

    for card_js in differ_card_js_list:
        for card_db in differ_card_db_list:
            if card_js.get('card_id') == card_db.get('card_id') and card_js != card_db:
                cards_to_change_list.append(card_js)

    data_to_query = []
    for card in cards_to_change_list:
        data_to_query.append([card.get('card_col_id'), card.get('card_order'), card.get('card_id')])

    if return_json:
        return json.dumps(cards_to_change_list, indent=2)
    else:
        return data_to_query


def get_all_public_data():
    """Return JSON for all data from the database tables: board, col, card.
    Return only public data for not sign in user."""
    return __get_data(__get_public_boards(), __get_public_columns(), __get_public_cards())


def get_all_public_private_data(user_id):
    """Return JSON for all data from the database tables: board, col, card.
    Return public and private data for sign in user."""
    return __get_data(__get_public_private_boards(user_id), __get_public_private_columns(user_id),
                      __get_public_private_cards(user_id))


def get_public_boards():
    """Return JSON for the boards from the database tables: board.
    Return only public data for not sign in user."""
    return __get_boards(__get_public_boards(), __get_public_columns())


def get_public_private_boards(user_id):
    """Return JSON for the boards from the database tables: board.
    Return public and private data for sign in user."""
    return __get_boards(__get_public_private_boards(user_id), __get_public_private_columns(user_id))


def get_public_board(board_id):
    """Return JSON for one board selected by ID from
    the database with the columns and the cards.
    Return only public data for not sign in user."""
    return __get_board(__get_public_board_by_board_id(board_id), __get_public_columns_by_board_id(board_id),
                       __get_public_cards_by_board_id(board_id))


def get_public_private_board(user_id, board_id):
    """Return JSON for one board selected by ID from
    the database with the columns and the cards.
    Return public and private data for sign in user."""
    return __get_board(__get_public_private_board_by_board_id(user_id, board_id),
                       __get_public_private_columns_by_board_id(board_id),
                       __get_public_private_cards_by_board_id(board_id))


def get_public_col(col_id):
    """Return JSON for one column selected by ID from
        the database with the cards.
        Return only public data for not sign in user."""
    return __get_column(__get_public_column_by_col_id(col_id), __get_public_cards_by_col_id(col_id))


def get_public_private_col(col_id):
    """Return JSON for one column selected by ID from
        the database with the cards.
        # Return public and private data."""
    return __get_column(__get_public_private_column_by_col_id(col_id), __get_public_private_cards_by_col_id(col_id))


def get_public_card(card_id):
    """Return JSON for one card selected by ID from the database.
    Return only public data for not sign in user."""
    return __get_card(__get_public_card_by_card_id(card_id))


def get_public_private_card(card_id):
    """Return JSON for one card selected by ID from the database.
    Return public and private data."""
    return __get_card(__get_public_private_card_by_card_id(card_id))


def get_public_board_dict(board_id):
    """Return Dictionary (RealDict) for one board selected by ID from
    the database with the columns and the cards.
    Return only public data for not sign in user."""
    return __get_board(__get_public_board_by_board_id(board_id), __get_public_columns_by_board_id(board_id),
                       __get_public_cards_by_board_id(board_id), return_json=False)


def get_public_private_board_dict(user_id, board_id):
    """Return Dictionary (RealDict) for one board selected by ID from
    the database with the columns and the cards.
    Return public and private data for sign in user."""
    return __get_board(__get_public_private_board_by_board_id(user_id, board_id),
                       __get_public_private_columns_by_board_id(board_id),
                       __get_public_private_cards_by_board_id(board_id), return_json=False)


if __name__ == '__main__':
    # print(__get_data(__get_public_boards(), __get_public_columns(), __get_public_cards()))
    # print(__get_boards(__get_public_boards(), __get_public_columns()))
    # print(get_public_board(1))
    # print(get_public_col(3))
    print(get_public_card(15))
