from asyncio.exceptions import TimeoutError
from typing import TYPE_CHECKING, Dict, List

from slack_bolt.async_app import AsyncApp
from tenacity import retry, retry_if_exception_type, stop_after_attempt

if TYPE_CHECKING:
    from utils.environments import BaseAppEnvironment


def initialize_slack_app(environment: 'BaseAppEnvironment', app_name: str):
    # Initializes your app with your bot token and signing secret
    app = AsyncApp(
        token=environment.bot_token,
        signing_secret=environment.signing_secret.get_secret_value(),
    )
    return app


async def open_dm_channels(slack_app: AsyncApp, users_channel_id: str):
    """
    this opens 1:1 direct message channels between the app and each of the users
    in a particular channel e.g. slackers-test
    """
    response = await slack_app.client.conversations_members(channel=users_channel_id)
    if response and (user_ids := response['members']):
        for user_id in user_ids:
            await slack_app.client.conversations_open(users=user_id)


@retry(stop=stop_after_attempt(3), retry=retry_if_exception_type(TimeoutError))
async def post_message_with_retry(
    slack_app: AsyncApp, channel: str, text: str, blocks: List[Dict]
):
    await slack_app.client.chat_postMessage(
        channel=channel,
        text=text,
        blocks=blocks,
    )
