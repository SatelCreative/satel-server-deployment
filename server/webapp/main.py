from logging import warning

import loguru
from fastapi import FastAPI
from starlette import status
from starlette.requests import Request
from starlette.responses import JSONResponse

from auth import auth_routes
from auth import init_db as auth_db
from daily_update import daily_update_router
from daily_update import environment as daily_update_env
from daily_update import init_daily_update_scheduler
from daily_update import init_db as daily_update_db
from peer_feedback import environment as peer_feedback_env
from peer_feedback import init_db as peer_feedback_init_db
from peer_feedback import (
    init_peer_feedback_scheduler,
    open_peer_feedback_dm_channels,
    peer_feedback_router,
)
from recognition import environment as recognition_env
from recognition import init_db as recog_init_db
from recognition import init_recognition_scheduler, recognition_router
from time_off import environment as time_off_env
from time_off import time_off_db, time_off_router
from twil import environment as twil_env
from twil import init_db as twil_init_db
from twil import twil_router
from utils import constants, environment

app = FastAPI()


@app.on_event('startup')
async def startup():
    await twil_init_db()
    await daily_update_db()
    await recog_init_db()
    await peer_feedback_init_db()
    init_daily_update_scheduler()
    init_recognition_scheduler()
    init_peer_feedback_scheduler()
    if peer_feedback_env.bot_token != constants.DUMMYTOKEN:
        # skip this in Jenkins CICD check
        await open_peer_feedback_dm_channels()
    time_off_db.start()
    await auth_db()


app.include_router(auth_routes)

if twil_env.is_configured:
    app.include_router(twil_router)
else:
    warning('TWIL is not configured properly. Router is not included in the app.')

if daily_update_env.is_configured:
    app.include_router(daily_update_router)
else:
    warning(
        'Daily Update is not configured properly.'
        ' Scheduler and router are not included in the app.'
    )

if time_off_env.is_configured:
    app.include_router(time_off_router)
else:
    warning('Time Off is not configured properly. Router is not included in the app.')

if recognition_env.is_configured:
    app.include_router(recognition_router)
else:
    warning('Recognition is not configured properly. Router is not included in the app.')

if peer_feedback_env.is_configured:
    app.include_router(peer_feedback_router)
else:
    warning('Peer Feedback is not configured properly. Router is not included in the app.')


async def handle_db_error(request: Request, error: Exception):
    message = {'detail': 'Error in the database'}
    if environment.development:
        message['detail'] = str(error)
    loguru.logger.error(error)
    return JSONResponse(content=message, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
