def create_home():
    """
    Generates the homepage for the slack page
    """

    # Find the current quarter

    blocks = [
        {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': '*Welcome to _TWILBot_* :robot_face:',
            },
        }
    ]

    return {'type': 'home', 'blocks': blocks}
