def set_card_order(cards: list):
    """Sets the cards order after deleting one card:
    :param cards: cards list of tuples [(card_id, card_order)] get from the SQL query,
    :return: ordered cards list of lists [[card_id, card_order]],
    only cards with changed order."""
    if cards:
        new_list = []
        i = 1
        for card in cards:
            if card[1] != i:
                new_list.append([i, card[0]])
            i += 1
        return new_list
    else:
        return []


if __name__ == '__main__':
    # test_list = [(8, 1), (3, 2), (9, 3), (10, 4), (69, 5), (70, 6), (71, 7), (72, 8), (73, 9), (81, 10), (82, 11)]
    # test_list = []
    test_list = [(8, 1), (3, 2), (10, 4), (69, 5), (70, 6), (71, 7), (72, 8), (73, 9), (81, 10), (82, 11)]

    print(set_card_order(test_list))
