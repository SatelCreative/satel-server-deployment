from fastapi import Depends, Request, Response
from fastapi.routing import APIRouter
from loguru import logger

from auth import check_auth
from peer_feedback.environment import environment
from slack import init_default_router
from slack.auth import check_slack_auth

from .constants import FEEDBACK_REQUEST_TYPE_TEAM
from .message_trigger import trigger_message
from .slack_app import slack_app
from .views import generate_peer_request_modal, generate_team_request_modal

peer_feedback_router = APIRouter(prefix='/peer_feedback')

default_slack_routes = init_default_router(slack_app=slack_app)

peer_feedback_router.include_router(default_slack_routes)


async def check_slack_auth_pf(request: Request):
    return await check_slack_auth(
        request,
        environment.signing_secret.get_secret_value(),
    )


@peer_feedback_router.post(
    '/send_reminder',
    dependencies=[Depends(check_auth)],
    tags=['PeerFeedback'],
)
async def trigger_reminder_message():
    """
    Used to manually trigger the peer feedback request reminder message.
    """
    try:
        await trigger_message()
    except Exception as e:
        logger.error(e)


@peer_feedback_router.post(
    '/requests',
    dependencies=[Depends(check_slack_auth_pf)],
    tags=['PeerFeedback'],
)
async def prompt_request_modal(request: Request) -> Response:
    """
    Used to invoke the modal for creating a feedback request.
    """
    form_data = await request.form()
    try:
        if (not (text := form_data['text'])) or (text != FEEDBACK_REQUEST_TYPE_TEAM):
            await slack_app.client.views_open(
                trigger_id=form_data['trigger_id'],
                view=generate_peer_request_modal(),
            )
        else:
            await slack_app.client.views_open(
                trigger_id=form_data['trigger_id'],
                view=generate_team_request_modal(),
            )

    except Exception as e:
        logger.error(e)

    return Response(status_code=200)
