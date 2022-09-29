from datetime import datetime

from daily_update.models import DailyUpdate
from utils.time import get_last_monday


async def create_home(user_id: str) -> dict:
    """
    Generates the homepage for the slack page
    """

    today = datetime.today()

    # Gets this weeks updates for yourself
    updates = await DailyUpdate.get_by_date_range(
        user_id,
        get_last_monday(),
        today,
    )

    # Generates all of the blocks that will be displayed
    blocks = [
        {
            'type': 'section',
            'text': {'type': 'mrkdwn', 'text': '*Your Weekly Updates* :muscle::skin-tone-5:'},
        },
        {'type': 'divider'},
    ]

    for update in updates:
        blocks.append(
            {
                'type': 'section',
                'text': {
                    'type': 'mrkdwn',
                    'text': f'{update.created_at}: {update.update_message}',
                },
            }
        )

    return {'type': 'home', 'blocks': blocks}
