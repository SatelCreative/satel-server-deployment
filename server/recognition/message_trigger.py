from functools import partial

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import HTTPException
from pytz import utc
from starlette.status import HTTP_400_BAD_REQUEST

from recognition import environment
from slack.client import RequestResponseBody
from slack.utils import post_message_with_retry

from .slack_app import slack_app
from .views import create_reminder


async def trigger_message():
    """
    Used as a scheduled trigger to the recognition reminder for a user.
    """
    channel_id = environment.main_channel
    channel_users = await slack_app.client.conversations_members(channel=channel_id)

    if not channel_users:
        return HTTPException(HTTP_400_BAD_REQUEST, 'No users found.')

    for user_id in channel_users['members']:
        user_info = RequestResponseBody.parse_obj(
            (await slack_app.client.users_info(user=user_id)).data
        )
        if user_info.user:
            reminder = create_reminder(user_info.user.name)

        await post_message_with_retry(
            slack_app=slack_app, channel=user_id, text='recognition', blocks=reminder
        )


def init_recognition_scheduler():
    scheduler = AsyncIOScheduler(timezone=utc)
    scheduler.add_job(
        partial(trigger_message),
        'cron',
        week='1-52',
        day_of_week=environment.day_of_week_reminder,
        hour=10,
        minute=0,
        timezone='America/Vancouver',
        max_instances=1,
    )
    scheduler.start()
