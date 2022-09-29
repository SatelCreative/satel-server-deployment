from __future__ import annotations

from functools import partial

from fastapi import Depends, Request
from fastapi.routing import APIRouter

from slack import init_default_router
from slack.auth import check_slack_auth
from slack.client import SlackSlashRequest
from time_off.environment import environment

from .slack_app import slack_app

time_off_router = APIRouter(prefix='/time_off')
default_slack_routes = init_default_router(slack_app=slack_app)
time_off_router.include_router(default_slack_routes)


check_slack_auth_to = partial(
    check_slack_auth, secret=environment.signing_secret.get_secret_value()
)


@time_off_router.post('/request', dependencies=[Depends(check_slack_auth_to)], tags=['TimeOff'])
async def time_off_request(request: Request):
    data = SlackSlashRequest.parse_obj(await request.form())
    return f'Data received: {data.text}'
