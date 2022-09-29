from __future__ import annotations

from fastapi import Depends, HTTPException, Request, status
from fastapi.routing import APIRouter
from loguru import logger

from recognition.environment import environment
from slack import init_default_router
from slack.client import SlackSlashRequest

from .message_trigger import trigger_message
from .slack_app import slack_app

recognition_router = APIRouter(prefix='/recognition')
default_slack_routes = init_default_router(slack_app=slack_app)
recognition_router.include_router(default_slack_routes)


async def check_user_app_admin(request: Request) -> None:
    body = SlackSlashRequest.parse_obj(await request.form())
    if body.user_id not in environment.admin:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, 'User is not an admin.')


@recognition_router.post(
    '/send-reminder',
    dependencies=[Depends(check_user_app_admin)],
    tags=['Recognition'],
)
async def send_reminder() -> str:
    try:
        await trigger_message()
    except Exception as e:
        logger.exception(e)
        return 'Error: Failed to send reminder'
    return 'Successfully sent recognition reminder to everyone'
