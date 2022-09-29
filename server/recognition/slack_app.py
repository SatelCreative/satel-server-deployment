from datetime import datetime
from typing import Any, Dict
from zoneinfo import ZoneInfo

from slack_bolt.async_app import AsyncApp
from slack_bolt.context.ack.async_ack import AsyncAck
from slack_sdk.web.async_client import AsyncWebClient

from recognition.environment import environment
from recognition.models import Recognition
from recognition.views import (
    create_home,
    generate_recognition_modal,
    recognition_message,
)
from slack.body import ActionResponseBody
from slack.client import RequestResponseBody
from slack.utils import initialize_slack_app

slack_app: AsyncApp = initialize_slack_app(environment=environment, app_name='Recognition')


@slack_app.event('app_home_opened')
async def update_home_tab(
    event: Dict[str, Any],
    client: AsyncWebClient,
):
    user_id = event['user']
    recognitions = await Recognition.get_list(recipient_slack_id=user_id)
    total_pages = await Recognition.get_total_pages(recipient_slack_id=user_id)
    await client.views_publish(
        user_id=user_id, view=await create_home(recognitions=recognitions, total_pages=total_pages)
    )


@slack_app.action('create_recognition')
async def create_recognition_action(
    ack: AsyncAck,
    body: Dict[str, Any],
    client: AsyncWebClient,
):
    parsed_body = ActionResponseBody.parse_obj(body)
    await client.views_open(
        trigger_id=parsed_body.trigger_id,
        view=generate_recognition_modal(),
    )

    await ack()


@slack_app.view('submit_recognition')
async def handle_submit_recognition(ack: AsyncAck, body: Dict[str, Any]):
    parsed_body = ActionResponseBody.parse_obj(body)
    if parsed_body.view and parsed_body.view.state:
        form_data = parsed_body.view.state.values

    recipient_id = form_data['recipient']['users_select-action']['selected_user']
    message = form_data['message']['message']['value']
    is_anonymous = len(form_data['anonymous']['check_anonymous']['selected_options']) > 0

    user = RequestResponseBody.parse_obj(
        (await slack_app.client.users_info(user=parsed_body.user.id)).data
    ).user

    recipient = RequestResponseBody.parse_obj(
        (await slack_app.client.users_info(user=recipient_id)).data
    ).user

    # Although in practice it shouldn't happen, since user can be None, mypy needs this test
    if user and recipient:
        username = user.name
        icon = user.profile.image_192

        sender_id = user.id
        sender_name = username
        if is_anonymous:
            username = 'Recognition App'
            icon = None
            sender_id = ''
            sender_name = 'Anonymous'

        await slack_app.client.chat_postMessage(
            channel=recipient_id,
            text='Recognition App',
            blocks=(
                recognition_message(message=message, sender=user.name, is_anonymous=is_anonymous)
            ),
            username=username,
            icon_url=icon,
        )

        await slack_app.client.chat_postMessage(
            channel=user.id,
            text=f'Thank you for sending a recognition to {recipient.name}! :smile:',
        )

        recognition = Recognition(
            sender_slack_id=sender_id,
            sender_name=sender_name,
            recipient_slack_id=recipient_id,
            message=message,
            created_at=datetime.now(tz=ZoneInfo('UTC')),
        )
        await recognition.save()

    await ack()


@slack_app.action('select_page')
async def handle_some_action(ack: AsyncAck, client: AsyncWebClient, body: Dict[str, Any]):
    parsed_body = ActionResponseBody.parse_obj(body)
    if parsed_body.view and parsed_body.view.state:
        form_data = parsed_body.view.state.values
    page = int(list(form_data.values())[0]['select_page']['selected_option']['value'])
    user = RequestResponseBody.parse_obj(
        (await slack_app.client.users_info(user=parsed_body.user.id)).data
    ).user

    await ack()

    # Although in practice it shouldn't happen, since user can be None, mypy needs this test
    if user:
        recognitions = await Recognition.get_list(recipient_slack_id=user.id, page=page)
        total_pages = await Recognition.get_total_pages(recipient_slack_id=user.id)
        await client.views_publish(
            user_id=user.id,
            view=await create_home(recognitions=recognitions, total_pages=total_pages, page=page),
        )


@slack_app.action('check_anonymous')
async def handle_check_anonymous(ack: AsyncAck):
    """Placeholder handler to avoid error when anonymous checkbox is toggled"""
    await ack()
