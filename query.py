__query_all = {
    # Queries to get data for JSON
    'board_select_public':
        """SELECT board_id, board_title, board_public, board_registration FROM board 
        WHERE board_public = true ORDER BY board_id;""",
    'col_select_public':
        """SELECT col.col_id, col.col_board_id, col.col_title, col.col_registration FROM col 
        INNER JOIN board ON board.board_public = true AND board.board_id = col.col_board_id
        ORDER BY col.col_id;""",
    'card_select_public':
        """SELECT c.card_id, c.card_board_id, c.card_col_id, c.card_order, c.card_title, 
        c.card_archive, c.card_registration
        FROM card AS c 
        INNER JOIN board AS b 
        ON b.board_public = true AND b.board_id = c.card_board_id AND c.card_archive = false
        ORDER BY c.card_order;""",
    'board_select_public_by_board_id':
        """SELECT board_id, board_title, board_public, board_registration 
        FROM board WHERE board_id = %s AND board_public = true
        ORDER BY board_id;""",
    'col_select_public_by_col_board_id':
        """SELECT c.col_id, c.col_board_id, c.col_title, c.col_registration 
        FROM col AS c INNER JOIN board AS b 
        ON b.board_public = true AND b.board_id = c.col_board_id AND c.col_board_id = %s
        ORDER BY c.col_id;""",
    'card_select_public_by_card_board_id':
        """SELECT c.card_id, c.card_board_id, c.card_col_id, c.card_order, c.card_title, 
        c.card_archive, c.card_registration FROM card AS c INNER JOIN board AS b 
        ON b.board_public = true AND b.board_id = c.card_board_id AND c.card_archive = false AND c.card_board_id = %s
        ORDER BY c.card_order;""",
    'col_select_public_by_col_id':
        """SELECT c.col_id, c.col_board_id, c.col_title, c.col_registration 
        FROM col AS c INNER JOIN board AS b 
        ON b.board_public = true AND b.board_id = c.col_board_id AND c.col_id = %s;""",
    'card_select_public_by_card_col_id':
        """SELECT c.card_id, c.card_board_id, c.card_col_id, c.card_order, c.card_title, 
        c.card_archive, c.card_registration FROM card AS c INNER JOIN board AS b 
        ON b.board_public = true AND b.board_id = c.card_board_id AND c.card_archive = false AND c.card_col_id = %s
        ORDER BY c.card_order;""",
    'card_select_public_by_card_id':
        """SELECT c.card_id, c.card_board_id, c.card_col_id, c.card_order, c.card_title, 
        c.card_archive, c.card_registration FROM card AS c INNER JOIN board AS b 
        ON b.board_public = true AND b.board_id = c.card_board_id 
        AND c.card_archive = false AND c.card_id = %s;""",

    # Queries to set data from JSON and insert or update DB.
    'board_update_board_title':
        """UPDATE board SET board_title = %s WHERE board_id = %s""",
    'board_insert_new_board':
    """WITH ROWS AS (
    INSERT INTO board (board_title, board_public) VALUES (%s, %s) RETURNING board_id
    )
    INSERT INTO col (col_board_id, col_title)
    VALUES
	    ((SELECT board_id FROM ROWS), 'New'),
	    ((SELECT board_id FROM ROWS), 'In Progress'),
	    ((SELECT board_id FROM ROWS), 'Testing'),
	    ((SELECT board_id FROM ROWS), 'Done');""",
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
