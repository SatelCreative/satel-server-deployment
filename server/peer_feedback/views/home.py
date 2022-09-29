async def create_home(user_id: str) -> dict:
    """
    Generates the homepage for the slack page
    """

    # Generates all of the blocks that will be displayed
    blocks = [
        {
            'type': 'section',
            'text': {'type': 'mrkdwn', 'text': f'*Hello* <@{user_id}>'},
        },
    ]

    return {'type': 'home', 'blocks': blocks}
