from functools import partial

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import HTTPException
from pytz import utc
from starlette.status import HTTP_400_BAD_REQUEST

from slack.client import RequestResponseBody
from slack.utils import post_message_with_retry

from .models import User
from .slack_app import slack_app
from .views import create_daily_message


async def trigger_message():
    """
    Used as a scheduled trigger to the daily update message for a user.
    """
    users = await User.find_all().to_list()

    if not users:
        return HTTPException(HTTP_400_BAD_REQUEST, 'No users in DB')

    for user in users:
        user_info = RequestResponseBody.parse_obj(
            (await slack_app.client.users_info(user=user.slack_id)).data
        )
        if user_info.user:
            daily_message = create_daily_message(user_info.user.name)

        await post_message_with_retry(
            slack_app=slack_app,
            channel=user.slack_id,
            text='daily update',
            blocks=daily_message,
        )


def init_daily_update_scheduler():
    # Adding daily update 9am scheduling monday-friday
    scheduler = AsyncIOScheduler(timezone=utc)
    scheduler.add_job(
        partial(trigger_message),
        'cron',
        week='1-52',
        day_of_week='mon-fri',
        hour=9,
        minute=0,
        timezone='America/Vancouver',
        max_instances=1,
    )
    scheduler.start()
