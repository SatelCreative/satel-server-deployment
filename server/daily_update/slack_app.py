from datetime import datetime
from typing import Any, Dict
from zoneinfo import ZoneInfo

from loguru import logger
from pytz import utc
from slack_bolt.async_app import AsyncApp
from slack_bolt.context.ack.async_ack import AsyncAck
from slack_sdk.web.async_client import AsyncWebClient

from daily_update.environment import environment as daily_update_env
from slack.body import ActionResponseBody
from slack.client import RequestResponseBody
from slack.utils import initialize_slack_app

from .models import DailyUpdate, UserInChannel
from .views import create_home, generate_update_modal, update_message

slack_app: AsyncApp = initialize_slack_app(daily_update_env, 'Daily Update')


@slack_app.event('app_home_opened')
async def update_home_tab(
    event: Dict[str, Any],
    client: AsyncWebClient,
):
    user_id = event['user']
    logger.info('Home tab opened')
    await client.views_publish(
        # the user that opened your app's app home
        user_id=user_id,
        # the view object that appears in the app home
        view=await create_home(user_id),
    )


# Handles the users inputs
@slack_app.action('create_update')
async def create_update_action(
    ack: AsyncAck,
    body: Dict[str, Any],
    client: AsyncWebClient,
):
    parsed_body = ActionResponseBody.parse_obj(body)
    await client.views_open(
        trigger_id=parsed_body.trigger_id,
        view=generate_update_modal(),
    )

    await ack()


@slack_app.view('submit_update')
async def handle_submit_update(ack: AsyncAck, body: Dict[str, Any]):
    await ack()
    parsed_body = ActionResponseBody.parse_obj(body)
    if parsed_body.view and parsed_body.view.state:
        form_data = parsed_body.view.state.values
    update = form_data['update']['update']['value']
    block = form_data['block']['block']['value']

    request = RequestResponseBody.parse_obj(
        (await slack_app.client.users_info(user=parsed_body.user.id)).data
    )

    now = datetime.now(tz=ZoneInfo(request.user.tz)).astimezone(utc)  # type: ignore[union-attr]
    updates = None

    try:
        updates = await DailyUpdate.get_by_id_and_date(
            slack_id=parsed_body.user.id, created_at=now  # type: ignore[arg-type]
        )
    except Exception as e:
        logger.error(e)

    if request.user:
        new_update = DailyUpdate(
            slack_id=parsed_body.user.id,
            update_message=update,
            block=block,
            created_at=datetime.now(tz=ZoneInfo(request.user.tz)).astimezone(utc),
        )

    if not daily_update_env.allow_multiple_updates and updates:
        try:
            if parsed_body.view:
                await slack_app.client.views_update(
                    view=generate_update_modal(error="You've already posted for today!"),
                    view_id=parsed_body.view.id,
                )
        except Exception as e:
            logger.error(e)
    try:
        await new_update.save()
        channels = await UserInChannel.get_by_slack_id(slack_id=parsed_body.user.id)

        # Gets the general info about the user that is posting
        user = RequestResponseBody.parse_obj(
            (await slack_app.client.users_info(user=parsed_body.user.id)).data
        )

        logger.info('Begin sending updates to channels')
        for channel in channels:
            if not user.user or not channel.channel_id:
                continue
            if request.user:
                await slack_app.client.chat_postMessage(
                    channel=channel.channel_id,
                    text=f'daily update from {parsed_body.user.name}',
                    blocks=(update_message(update, block)),
                    username=request.user.name,
                    icon_url=user.user.profile.image_192,
                )
                logger.info(
                    f"Successfully sent user {request.user.name}'s update to {channel.slack_id}"
                )
        logger.info('Finished sending updates')
    except Exception as e:
        logger.error(e)
