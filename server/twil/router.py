from datetime import datetime

from fastapi import Request
from fastapi.routing import APIRouter
from pytz import timezone

from models.slack_data import SlackData
from slack import init_default_router
from slack.client import SlackSlashRequest
from utils.time import get_last_monday, get_next_sunday

from .models import User, Vote
from .slack_app import slack_app

twil_router = APIRouter(prefix='/twil')
default_slack_routes = init_default_router(slack_app=slack_app)
twil_router.include_router(default_slack_routes)

TWIL_TEAMS = ['backend', 'frontend']


async def verify_and_save_vote(slack_data: SlackSlashRequest, team: str) -> str:
    votee_data = SlackData.parse_user(slack_data.text)
    votee_id = votee_data.user_id
    now = datetime.now().astimezone(timezone('US/Pacific'))

    if slack_data.user_id == votee_id:
        return 'Error: You cannot vote for yourself'

    voter = await User.find_one(User.slack_id == slack_data.user_id, User.team == team)
    votee = await User.find_one(User.slack_id == votee_id, User.team == team)

    if not voter or not votee:
        return 'User not found'

    existing = (
        await Vote.find(
            {
                'voter_slack_id': voter.slack_id,
                'created_at': {'$lt': get_next_sunday()},
            }
        )
        .find({'created_at': {'$gt': get_last_monday()}})
        .first_or_none()
    )

    if existing:
        existing.votee_slack_id = votee.slack_id
        await existing.save()
    else:
        vote = Vote(voter_slack_id=voter.slack_id, votee_slack_id=votee.slack_id, created_at=now)
        await vote.save()
    return f'You have successfully voted for {team} team!'


@twil_router.post('/add-user', tags=['TWIL'])
async def add_user(req: Request):
    """
    Endpoint that allows admins to add users to the app
    """
    slack_data = SlackSlashRequest.parse_obj(await req.form())
    data = slack_data.text.split(' ')
    user_data = SlackData.parse_user(data[0])
    admin = await User.find_one(User.slack_id == slack_data.user_id)

    if not data[1] in TWIL_TEAMS:
        return 'Error: Invalid team name'

    if not admin or not admin.role == 'admin':
        return 'Error: Need admin permission to add user'

    existing = await User.find(User.slack_id == user_data.user_id, User.team == data[1]).to_list()
    if existing:
        return f'User {user_data.username} is already a member of {data[1]} team.'

    user = User(slack_id=user_data.user_id, team=data[1])
    await user.save()
    return 'User successfully added'


@twil_router.post('/vote-backend', tags=['TWIL'])
async def vote_backend(req: Request):
    """
    Endpoint that allows a backend member to vote for other backend members.
    """
    data = SlackSlashRequest.parse_obj(await req.form())
    result = await verify_and_save_vote(slack_data=data, team='backend')
    return result


@twil_router.post('/vote-frontend', tags=['TWIL'])
async def vote_frontend(req: Request):
    """
    Endpoint that allows a frontend member to vote for other frontend members.
    """
    data = SlackSlashRequest.parse_obj(await req.form())
    result = await verify_and_save_vote(slack_data=data, team='frontend')
    return result
