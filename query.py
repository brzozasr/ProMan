__query_all = {
    # Queries to get data for JSON
    'board_select_public':
        """SELECT board_id, board_title, board_public, board_registration FROM board 
        WHERE board_public = true ORDER BY board_id;""",
    'board_select_public_private':
        """SELECT board.board_id, board.board_title, board.board_public, 
        board.board_registration FROM board WHERE board.board_public = true
        UNION
        SELECT board.board_id, board.board_title, board.board_public, 
        board.board_registration FROM board INNER JOIN coworker
        ON board.board_id = coworker.coworker_board_id AND coworker.coworker_users_id = %s
        ORDER BY board_id;""",
    'col_select_public':
        """SELECT col.col_id, col.col_board_id, col.col_title, col.col_registration FROM col 
        INNER JOIN board ON board.board_public = true AND board.board_id = col.col_board_id
        ORDER BY col.col_id;""",
    'col_select_public_private':
        """SELECT cpu.col_id, cpu.col_board_id, cpu.col_title, cpu.col_registration FROM col AS cpu 
        INNER JOIN board AS bpu ON bpu.board_public = true AND bpu.board_id = cpu.col_board_id
        UNION
        SELECT cpr.col_id, cpr.col_board_id, cpr.col_title, cpr.col_registration FROM col AS cpr
        INNER JOIN board AS bpr ON bpr.board_public = false AND bpr.board_id = cpr.col_board_id
        INNER JOIN coworker AS cow ON cpr.col_board_id = cow.coworker_board_id AND cow.coworker_users_id = %s
        ORDER BY col_id;""",
    'card_select_public':
        """SELECT c.card_id, c.card_board_id, c.card_col_id, c.card_order, c.card_title, 
        c.card_archive, c.card_registration
        FROM card AS c 
        INNER JOIN board AS b 
        ON b.board_public = true AND b.board_id = c.card_board_id AND c.card_archive = false
        ORDER BY c.card_order;""",
    'card_select_public_private':
        """SELECT cpu.card_id, cpu.card_board_id, cpu.card_col_id, cpu.card_order, cpu.card_title, 
        cpu.card_archive, cpu.card_registration FROM card AS cpu 
        INNER JOIN board AS bpu 
        ON bpu.board_public = true AND bpu.board_id = cpu.card_board_id AND cpu.card_archive = false
        UNION
        SELECT cpr.card_id, cpr.card_board_id, cpr.card_col_id, cpr.card_order, cpr.card_title, 
        cpr.card_archive, cpr.card_registration FROM card AS cpr 
        INNER JOIN board AS bpr 
        ON bpr.board_public = false AND bpr.board_id = cpr.card_board_id AND cpr.card_archive = false
        INNER JOIN coworker AS cow 
        ON cpr.card_board_id = cow.coworker_board_id AND cow.coworker_users_id = %s
        ORDER BY card_order;""",
    'board_select_public_by_board_id':
        """SELECT board_id, board_title, board_public, board_registration 
        FROM board WHERE board_id = %s AND board_public = true
        ORDER BY board_id;""",
    'board_select_public_private_by_board_id':
        """SELECT DISTINCT ON (b.board_id) b.board_id, b.board_title, b.board_public, b.board_registration
        FROM board AS b
        INNER JOIN coworker AS c
        ON (c.coworker_board_id = b.board_id AND c.coworker_users_id = %(user_id)s AND b.board_id = %(board_id)s 
        AND b.board_public = false) OR (b.board_id = %(board_id)s AND b.board_public = true)
        ORDER BY b.board_id;""",
    'col_select_public_by_col_board_id':
        """SELECT c.col_id, c.col_board_id, c.col_title, c.col_registration 
        FROM col AS c INNER JOIN board AS b 
        ON b.board_public = true AND b.board_id = c.col_board_id AND c.col_board_id = %s
        ORDER BY c.col_id;""",
    'col_select_public_private_by_col_board_id':
        """SELECT c.col_id, c.col_board_id, c.col_title, c.col_registration 
        FROM col AS c INNER JOIN board AS b 
        ON b.board_id = c.col_board_id AND c.col_board_id = %s ORDER BY c.col_id;""",
    'card_select_public_by_card_board_id':
        """SELECT c.card_id, c.card_board_id, c.card_col_id, c.card_order, c.card_title, 
        c.card_archive, c.card_registration FROM card AS c INNER JOIN board AS b 
        ON b.board_public = true AND b.board_id = c.card_board_id AND c.card_archive = false AND c.card_board_id = %s
        ORDER BY c.card_order;""",
    'card_select_public_private_by_card_board_id':
        """SELECT c.card_id, c.card_board_id, c.card_col_id, c.card_order, c.card_title, 
        c.card_archive, c.card_registration FROM card AS c INNER JOIN board AS b 
        ON b.board_id = c.card_board_id AND c.card_archive = false AND c.card_board_id = %s
        ORDER BY c.card_order;""",
    'col_select_public_by_col_id':
        """SELECT c.col_id, c.col_board_id, c.col_title, c.col_registration 
        FROM col AS c INNER JOIN board AS b 
        ON b.board_public = true AND b.board_id = c.col_board_id AND c.col_id = %s;""",
    'col_select_public_private_by_col_id':
        """SELECT c.col_id, c.col_board_id, c.col_title, c.col_registration 
        FROM col AS c INNER JOIN board AS b 
        ON b.board_id = c.col_board_id AND c.col_id = %s;""",
    'card_select_public_by_card_col_id':
        """SELECT c.card_id, c.card_board_id, c.card_col_id, c.card_order, c.card_title, 
        c.card_archive, c.card_registration FROM card AS c INNER JOIN board AS b 
        ON b.board_public = true AND b.board_id = c.card_board_id AND c.card_archive = false AND c.card_col_id = %s
        ORDER BY c.card_order;""",
    'card_select_public_private_by_card_col_id':
        """SELECT c.card_id, c.card_board_id, c.card_col_id, c.card_order, c.card_title, 
        c.card_archive, c.card_registration FROM card AS c INNER JOIN board AS b 
        ON b.board_id = c.card_board_id AND c.card_archive = false AND c.card_col_id = %s
        ORDER BY c.card_order;""",
    'card_select_public_by_card_id':
        """SELECT c.card_id, c.card_board_id, c.card_col_id, c.card_order, c.card_title, 
        c.card_archive, c.card_registration FROM card AS c INNER JOIN board AS b 
        ON b.board_public = true AND b.board_id = c.card_board_id 
        AND c.card_archive = false AND c.card_id = %s;""",
    'card_select_public_private_by_card_id':
        """SELECT c.card_id, c.card_board_id, c.card_col_id, c.card_order, c.card_title, 
        c.card_archive, c.card_registration FROM card AS c INNER JOIN board AS b 
        ON b.board_id = c.card_board_id 
        AND c.card_archive = false AND c.card_id = %s;""",

    # Queries to set data from JSON and insert or update DB.
    'board_update_board_title':
        """UPDATE board SET board_title = %s WHERE board_id = %s""",
    'board_insert_new_board':
        """INSERT INTO board (board_title, board_public) VALUES (%s, %s) RETURNING board_id;""",
    'col_insert_default_cols':
        """INSERT INTO col (col_board_id, col_title)
        VALUES (%(board_id)s, 'New'), (%(board_id)s, 'In Progress'), (%(board_id)s, 'Testing'), 
        (%(board_id)s, 'Done');""",
    'col_insert_new_col':
        """INSERT INTO col (col_board_id, col_title) VALUES (%s, %s);""",
    'card_select_max_card_order_in_col':
        """SELECT card_order FROM card
        WHERE card_order = (
        SELECT MAX (card_order) FROM card WHERE card_col_id = %(col_id)s
        ) AND card_col_id = %(col_id)s AND card_archive = false;""",
    'card_insert_new_card':
        """INSERT INTO card (card_board_id, card_col_id, card_order, card_title) 
        VALUES (%s, %s, %s, %s);""",
    'card_update_card_position':
        """UPDATE card SET card_col_id = %s, card_order = %s WHERE card_id = %s""",
    'col_update_col_title':
        """UPDATE col SET col_title = %s WHERE col_id = %s""",
    'card_update_card_title':
        """UPDATE card SET card_title = %s WHERE card_id = %s""",
    'board_delete_by_id_board':
        """DELETE FROM board WHERE board_id = %s""",
    'col_delete_by_col_id':
        """DELETE FROM col WHERE col_id = %s;""",
    'card_delete_by_card_id':
        """DELETE FROM card WHERE card_id = %s;""",
    'card_select_by_card_col_id':
        """SELECT card_id, card_order FROM card WHERE card_col_id = %s AND card_archive = false 
    ORDER BY card_order""",
    'card_update_card_order_by_card_id':
        """UPDATE card SET card_order = %s WHERE card_id = %s""",
    'card_update_card_archive':
        """UPDATE card SET card_order = 0, card_archive = true WHERE card_id = %s AND card_archive = false;""",
    'card_update_card_unarchive':
        """UPDATE card SET card_order = %s, card_archive = false WHERE card_id = %s AND card_archive = true;""",
    'users_select_by_users_login':
        """SELECT users_id, users_login, users_pass FROM users WHERE users_login = %s;""",
    'users_insert_new_user':
        """INSERT INTO users (users_login, users_pass) VALUES (%s, %s);""",
    'coworker_insert_new_coworker':
        """INSERT INTO coworker (coworker_users_id, coworker_board_id) VALUES (%s, %s);""",
    'card_select_by_archive_cards':  # TODO
        """SELECT card_id, card_board_id, card_col_id, card_order, card_title, card_archive, card_registration 
        FROM card WHERE card_archive = true ORDER BY card_registration;""",
    'card_select_public_archive_cards':
        """SELECT c.card_id, c.card_board_id, c.card_col_id, c.card_order, c.card_title, 
        c.card_archive, c.card_registration FROM card AS c INNER JOIN board AS b 
        ON b.board_public = true AND b.board_id = c.card_board_id AND c.card_archive = true
        ORDER BY c.card_order;""",
    'card_select_public_private_archive_cards':
        """SELECT c.card_id, c.card_board_id, c.card_col_id, c.card_order, c.card_title, 
        c.card_archive, c.card_registration FROM card AS c INNER JOIN board AS b 
        ON b.board_public = true AND b.board_id = c.card_board_id AND c.card_archive = true
        UNION
        SELECT c.card_id, c.card_board_id, c.card_col_id, c.card_order, c.card_title, 
        c.card_archive, c.card_registration FROM card AS c INNER JOIN board AS b 
        ON b.board_public = false AND b.board_id = c.card_board_id AND c.card_archive = true
        INNER JOIN coworker AS co ON b.board_id = co.coworker_board_id AND co.coworker_users_id = %s
        ORDER BY card_order;""",
    'col_select_col_unarchive':
        """SELECT col_id, col_board_id, col_title, col_registration 
        FROM col WHERE col_id = %s;""",
    'card_select_cards_unarchive':
        """SELECT card_id, card_board_id, card_col_id, card_order, card_title, card_archive, 
        card_registration FROM card WHERE card_col_id = %s AND card_archive = false;""",
    # 'board_insert_new_board':
        # """WITH ROWS AS (
        # INSERT INTO board (board_title, board_public) VALUES (%s, %s) RETURNING board_id
        # )
        # INSERT INTO col (col_board_id, col_title)
        # VALUES
        #     ((SELECT board_id FROM ROWS), 'New'),
        #     ((SELECT board_id FROM ROWS), 'In Progress'),
        #     ((SELECT board_id FROM ROWS), 'Testing'),
        #     ((SELECT board_id FROM ROWS), 'Done');""",
}


class Query:
    def __init__(self, query_dict):
        self.__query = query_dict

    def __getattr__(self, key):
        try:
            return self.__query[key]
        except KeyError as e:
            raise AttributeError(e)


query = Query(__query_all)
