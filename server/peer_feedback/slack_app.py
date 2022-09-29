from datetime import datetime
from typing import Any, Dict
from zoneinfo import ZoneInfo

from loguru import logger
from slack_bolt.async_app import AsyncApp
from slack_bolt.context.ack.async_ack import AsyncAck
from slack_sdk.web.async_client import AsyncWebClient

from peer_feedback.environment import environment
from peer_feedback.models import FeedbackRequest, FeedbackResponse
from slack.body import ActionResponseBody, Metadata
from slack.message import Section, Text
from slack.utils import initialize_slack_app

from .constants import (
    ANONYMOUS_CHECKBOX_ACTION_ID,
    ANONYMOUS_CHECKBOX_BLOCK_ID,
    MEMBERS_SELECT_BLOCK_ID,
    MULTI_MEMBERS_SELECT_ACTION_ID,
    PARAMETERS_INPUT_BLOCK_ID,
    PARAMETERS_TEXT_INPUT_ACTION_ID,
    PEER_FEEDBACK_REQUEST_CREATE_BUTTON_ACTION_ID,
    PEER_FEEDBACK_REQUEST_SUBMIT_CALLBACK_ID,
    PEER_FEEDBACK_RESPONSE_SUBMIT_BUTTON_ACTION_ID,
    RECIPIENT_NAME_INPUT_BLOCK_ID,
    RECIPIENT_NAME_TEXT_INPUT_ACTION_ID,
    RESPONSE_INPUT_BLOCK_ID,
    RESPONSE_TEXT_INPUT_ACTION_ID,
    TEAM_FEEDBACK_REQUEST_SUBMIT_CALLBACK_ID,
    TEAM_FEEDBACK_RESPONSE_SUBMIT_BUTTON_ACTION_ID,
)
from .views import (
    construct_peer_request_message,
    construct_peer_response_message,
    construct_team_request_message,
    construct_team_response_message,
    create_home,
    generate_peer_request_modal,
)

slack_app: AsyncApp = initialize_slack_app(environment=environment, app_name=environment.app_name)


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
        view=await create_home(user_id=user_id),
    )


# Handles the users inputs
@slack_app.action(PEER_FEEDBACK_REQUEST_CREATE_BUTTON_ACTION_ID)
async def create_peer_feedback_request(
    ack: AsyncAck,
    body: Dict[str, Any],
    client: AsyncWebClient,
):
    parsed_body = ActionResponseBody.parse_obj(body)
    await client.views_open(
        trigger_id=parsed_body.trigger_id,
        view=generate_peer_request_modal(),
    )

    await ack()


@slack_app.view(PEER_FEEDBACK_REQUEST_SUBMIT_CALLBACK_ID)
async def submit_peer_feedback_request(
    body: Dict[str, Any],
    ack: AsyncAck,
    client: AsyncWebClient,
):
    await ack()
    parsed_body = ActionResponseBody.parse_obj(body)
    requester_user = parsed_body.user

    if parsed_body.view and parsed_body.view.state:
        form_data = parsed_body.view.state.values
        recipient_ids = form_data[MEMBERS_SELECT_BLOCK_ID][MULTI_MEMBERS_SELECT_ACTION_ID][
            'selected_users'
        ]
        parameters_input = form_data[PARAMETERS_INPUT_BLOCK_ID][PARAMETERS_TEXT_INPUT_ACTION_ID][
            'value'
        ]

        multiple_recipients = len(recipient_ids) > 1
        for recipient_id in recipient_ids:
            await client.chat_postMessage(
                channel=recipient_id,
                blocks=construct_peer_request_message(
                    feedback_parameters=parameters_input,
                    requester_user_name=requester_user.name,
                    multiple_recipients=multiple_recipients,
                ),
                metadata=dict(
                    Metadata(
                        event_type='peer_request_sent',
                        event_payload={
                            'request_trigger_id': parsed_body.trigger_id,
                            'requester': dict(requester_user),
                        },
                    )
                ),
            )

        feedback_request = FeedbackRequest(
            trigger_slack_id=parsed_body.trigger_id,
            requester_slack_id=requester_user.id,
            requester_name=requester_user.name,
            respondent_slack_ids=recipient_ids,
            created_at=datetime.now(tz=ZoneInfo('UTC')),
            parameters=parameters_input,
        )
        await feedback_request.save()


@slack_app.action(ANONYMOUS_CHECKBOX_ACTION_ID)
async def handle_check_anonymous(ack: AsyncAck):
    """Placeholder handler to avoid error when anonymous checkbox is toggled"""
    await ack()


@slack_app.action(PEER_FEEDBACK_RESPONSE_SUBMIT_BUTTON_ACTION_ID)
async def submit_peer_feedback_response(
    ack: AsyncAck,
    client: AsyncWebClient,
    body: Dict[str, Any],
):
    parsed_body = ActionResponseBody.parse_obj(body)
    response_user = parsed_body.user
    thank_you_text = 'Thank you for submitting your feedback 👍'
    submitted_message_blocks = []
    if parsed_body.message:
        for block in parsed_body.message.blocks[:2]:
            submitted_message_blocks.append(block.dict(exclude_none=True))
        submitted_message_blocks.append(
            Section(text=Text(text=thank_you_text)).dict(exclude_none=True)
        )
        await ack()

        if parsed_body.channel:
            # update the message after the feedback is submitted
            await client.chat_update(
                channel=parsed_body.channel.id,
                ts=str(parsed_body.message.ts),
                blocks=submitted_message_blocks,
                text=thank_you_text,
            )

        if (
            parsed_body.state
            and parsed_body.message.metadata
            and parsed_body.message.blocks[1].text
        ):
            # send the feedback message to the requester
            response = parsed_body.state.values[RESPONSE_INPUT_BLOCK_ID][
                RESPONSE_TEXT_INPUT_ACTION_ID
            ]['value']

            is_anonymous = (
                True
                if (
                    (checkbox := parsed_body.state.values.get(ANONYMOUS_CHECKBOX_BLOCK_ID))
                    and checkbox[ANONYMOUS_CHECKBOX_ACTION_ID]['selected_options']
                )
                else False
            )
            response_user_name = 'Someone' if is_anonymous else response_user.name
            await client.chat_postMessage(
                channel=parsed_body.message.metadata.event_payload['requester']['id'],
                blocks=construct_peer_response_message(
                    response_user_name=response_user_name,
                    feedback_parameters=parsed_body.message.blocks[1].text.text,
                    response=response,
                ),
            )

            feedback_response = FeedbackResponse(
                request_trigger_slack_id=parsed_body.message.metadata.event_payload[
                    'request_trigger_id'
                ],
                # store the user is for the purpose of user stats
                respondent_slack_id=response_user.id,
                respondent_name=response_user_name,
                created_at=datetime.now(tz=ZoneInfo('UTC')),
                response=response,
                is_anonymous=is_anonymous,
            )
            await feedback_response.save()


@slack_app.view(TEAM_FEEDBACK_REQUEST_SUBMIT_CALLBACK_ID)
async def submit_team_feedback_request(
    body: Dict[str, Any],
    ack: AsyncAck,
    client: AsyncWebClient,
):
    await ack()
    parsed_body = ActionResponseBody.parse_obj(body)
    requester_user = parsed_body.user
    if parsed_body.view and parsed_body.view.state:
        form_data = parsed_body.view.state.values
        recipient_ids = form_data[MEMBERS_SELECT_BLOCK_ID][MULTI_MEMBERS_SELECT_ACTION_ID][
            'selected_users'
        ]
        parameters_input = form_data[PARAMETERS_INPUT_BLOCK_ID][PARAMETERS_TEXT_INPUT_ACTION_ID][
            'value'
        ]
        feedback_recipient_name = form_data[RECIPIENT_NAME_INPUT_BLOCK_ID][
            RECIPIENT_NAME_TEXT_INPUT_ACTION_ID
        ]['value']
        for recipient_id in recipient_ids:
            await client.chat_postMessage(
                channel=recipient_id,
                blocks=construct_team_request_message(
                    feedback_parameters=parameters_input,
                    requester_user_name=requester_user.name,
                    feedback_recipient_name=feedback_recipient_name,
                ),
                metadata=dict(
                    Metadata(
                        event_type='team_request_sent',
                        event_payload={
                            'request_trigger_id': parsed_body.trigger_id,
                            'requester': dict(requester_user),
                            'feedback_recipient_name': feedback_recipient_name,
                        },
                    )
                ),
            )

        feedback_request = FeedbackRequest(
            trigger_slack_id=parsed_body.trigger_id,
            requester_slack_id=requester_user.id,
            requester_name=requester_user.name,
            respondent_slack_ids=recipient_ids,
            feedback_recipient_name=feedback_recipient_name,
            created_at=datetime.now(tz=ZoneInfo('UTC')),
            parameters=parameters_input,
        )
        await feedback_request.save()


@slack_app.action(TEAM_FEEDBACK_RESPONSE_SUBMIT_BUTTON_ACTION_ID)
async def submit_team_feedback_response(
    ack: AsyncAck,
    client: AsyncWebClient,
    body: Dict[str, Any],
):
    await ack()
    parsed_body = ActionResponseBody.parse_obj(body)
    response_user = parsed_body.user
    thank_you_text = 'Thank you for submitting your feedback 👍'
    submitted_message_blocks = []
    if parsed_body.message:
        for block in parsed_body.message.blocks[:2]:
            submitted_message_blocks.append(block.dict(exclude_none=True))
        submitted_message_blocks.append(
            Section(text=Text(text=thank_you_text)).dict(exclude_none=True)
        )

        if parsed_body.channel:
            # update the message after the feedback is submitted
            await client.chat_update(
                channel=parsed_body.channel.id,
                ts=str(parsed_body.message.ts),
                blocks=submitted_message_blocks,
                text=thank_you_text,
            )

        if (
            parsed_body.state
            and parsed_body.message.metadata
            and parsed_body.message.blocks[1].text
        ):
            # send the feedback message to the requester
            response = parsed_body.state.values[RESPONSE_INPUT_BLOCK_ID][
                RESPONSE_TEXT_INPUT_ACTION_ID
            ]['value']
            await client.chat_postMessage(
                channel=parsed_body.message.metadata.event_payload['requester']['id'],
                blocks=construct_team_response_message(
                    response_user_name=response_user.name,
                    feedback_parameters=parsed_body.message.blocks[1].text.text,
                    response=response,
                    recipient_name=parsed_body.message.metadata.event_payload[
                        'feedback_recipient_name'
                    ],
                ),
            )

            feedback_response = FeedbackResponse(
                request_trigger_slack_id=parsed_body.message.metadata.event_payload[
                    'request_trigger_id'
                ],
                respondent_slack_id=response_user.id,
                respondent_name=response_user.name,
                created_at=datetime.now(tz=ZoneInfo('UTC')),
                response=response,
            )
            await feedback_response.save()
