from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import HTTPException
from starlette.status import HTTP_400_BAD_REQUEST

from peer_feedback import environment
from slack.utils import open_dm_channels, post_message_with_retry

from .slack_app import slack_app
from .views import create_reminder


async def trigger_message():
    """
    Used as a scheduled trigger to the peer feedback request reminder for a user.
    """
    app_user_id = environment.slack_app_user_id
    user_conversations = await slack_app.client.users_conversations(
        user_id=app_user_id, types='im'
    )
    if not user_conversations:
        return HTTPException(HTTP_400_BAD_REQUEST, 'No user conversation found.')

    for channel in user_conversations['channels']:
        channel_id = channel['id']
        reminder = create_reminder()
        await post_message_with_retry(
            slack_app=slack_app, channel=channel_id, text='peer_feedback', blocks=reminder
        )


def init_peer_feedback_scheduler():
    scheduler = AsyncIOScheduler()
    scheduler.add_job(
        trigger_message,
        'interval',
        weeks=2,
        start_date='2022-07-01 09:00:00',
        timezone='America/Vancouver',
        max_instances=1,
    )
    scheduler.start()


async def open_peer_feedback_dm_channels():
    await open_dm_channels(slack_app=slack_app, users_channel_id=environment.slack_chat_channel)
