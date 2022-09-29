def create_home(userId: str) -> dict:
    """
    Generates the homepage for the slack page
    """

    # Generates all of the blocks that will be displayed
    blocks = [
        {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': '*Welcome to Time Off App!* :spiral_calendar_pad:',
            },
        },
        {
            'type': 'actions',
            'elements': [
                {
                    'type': 'button',
                    'text': {
                        'type': 'plain_text',
                        'text': 'Request Personal Time Off',
                    },
                    'value': 'trigger_personal_time_off',
                    'action_id': 'create_personal_time_off',
                }
            ],
        },
    ]

    return {'type': 'home', 'blocks': blocks}
