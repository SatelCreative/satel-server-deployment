from __future__ import annotations

import re
from datetime import datetime
from typing import List, Optional
from zoneinfo import ZoneInfo

from beanie.operators import Set
from fastapi import Depends, HTTPException, Request, status
from fastapi.routing import APIRouter
from loguru import logger
from pytz import utc

from auth import check_auth
from daily_update.environment import environment
from models import SlackData
from slack import init_default_router
from slack.auth import check_slack_auth
from slack.client import RequestResponseBody, SlackSlashRequest

from .message_trigger import trigger_message
from .models import Channel, DailyUpdate, Role, User, UserInChannel
from .slack_app import slack_app


async def check_user_admin(request: Request):
    body = SlackSlashRequest.parse_obj(await request.form())
    if body.user_id in environment.admin:
        return
    raise HTTPException(status.HTTP_401_UNAUTHORIZED, 'User is not an admin.')


async def check_slack_auth_du(request: Request):
    return await check_slack_auth(
        request,
        environment.signing_secret.get_secret_value(),
    )


daily_update_router = APIRouter(prefix='/daily_update')

default_slack_routes = init_default_router(slack_app=slack_app)

daily_update_router.include_router(default_slack_routes)


# This entire section is for custom routes


@daily_update_router.post('/update', dependencies=[Depends(check_auth)], tags=['DailyUpdate'])
async def add_update(update: DailyUpdate):
    try:
        if not update.created_at:
            request = RequestResponseBody.parse_obj(
                (await slack_app.client.users_info(user=update.slack_id)).data
            )
            if request.user:
                update.created_at = str(datetime.now(tz=ZoneInfo(request.user.tz)).astimezone(utc))

        await update.save()
    except Exception as e:
        logger.error(e)


@daily_update_router.get(
    '/update/{slack_id}',
    dependencies=[Depends(check_auth)],
    response_model=List[DailyUpdate],
    tags=['DailyUpdate'],
)
async def get_updates(slack_id: str) -> Optional[List[DailyUpdate]]:
    try:
        updates = await DailyUpdate.get_by_slack_id(slack_id=slack_id)
        return updates
    except Exception as e:
        logger.error(e)
    return None


@daily_update_router.post('/user', dependencies=[Depends(check_auth)], tags=['DailyUpdate'])
async def add_user(user: User):
    user_info = RequestResponseBody.parse_obj(
        (await slack_app.client.users_info(user=user.slack_id)).data
    )
    if user_info.user:
        user.slack_name = user_info.user.name
        try:
            await user.save()
        except Exception as e:
            logger.error(e)


@daily_update_router.get(
    '/users',
    dependencies=[Depends(check_auth)],
    response_model=List[User],
    tags=['DailyUpdate'],
)
async def get_users() -> Optional[List[User]]:
    try:
        users = await User.all().to_list()
        return users
    except Exception as e:
        logger.error(e)
    return None


@daily_update_router.get(
    '/user/{slack_id}',
    dependencies=[Depends(check_auth)],
    response_model=User,
    tags=['DailyUpdate'],
)
async def get_user(slack_id: str) -> Optional[User]:
    try:
        user = await User.get_by_slack_id(slack_id=slack_id)
        return user
    except Exception as e:
        logger.error(e)
    return None


@daily_update_router.post(
    '/add-user',
    dependencies=[Depends(check_slack_auth_du), Depends(check_user_admin)],
    tags=['DailyUpdate'],
)
async def add_user_to_channel(request: Request) -> str:
    data = SlackSlashRequest.parse_obj(await request.form())
    if not data.text:
        return 'Error: No data received'

    slack_data = SlackData.parse(data.text)
    username = slack_data.username

    if not username:
        user_info = RequestResponseBody.parse_obj(
            (await slack_app.client.users_info(user=slack_data.user_id)).data
        )
        if user_info.user:
            username = user_info.user.name

    try:
        # Add the channel if it doesn't exist in the db
        await Channel.find_one({'channel_id': slack_data.channel_id}).upsert(
            Set({Channel.channel_name: slack_data.channel}),
            on_insert=Channel(channel_id=slack_data.channel_id, channel_name=slack_data.channel),
        )

        # Add the user if they don't exist
        await User.find_one({'slack_id': slack_data.user_id}).upsert(
            Set({User.slack_name: username}),
            on_insert=User(slack_id=slack_data.user_id, slack_name=username),
        )

        users = await UserInChannel.get_by_channel_id(channel_id=slack_data.channel_id)
        user_ids_in_channel = [user.slack_id for user in users]

        # Add the relationship between the two
        if slack_data.user_id not in user_ids_in_channel:
            await UserInChannel(
                slack_id=slack_data.user_id, channel_id=slack_data.channel_id
            ).save()
        else:
            return f'User {username} already exists in the channel {slack_data.channel}'
    except Exception:
        logger.exception('Problem when adding a new user to channel')
        return 'Error occurred.'

    return f'User {username} was added to channel, {slack_data.channel}'


@daily_update_router.post(
    '/remove-user',
    dependencies=[Depends(check_slack_auth_du), Depends(check_user_admin)],
    tags=['DailyUpdate'],
)
async def remove_user_from_channel(request: Request) -> str:
    data = SlackSlashRequest.parse_obj(await request.form())
    if not data.text:
        return 'Error: No data received'

    slack_data = SlackData.parse(data.text)

    try:
        await UserInChannel.remove_user_from_channel(
            slack_id=slack_data.user_id, channel_id=slack_data.channel_id
        )
    except Exception as e:
        logger.error(e)
        return 'Error removing user from channel'

    return f'User {slack_data.username} was removed from channel: {slack_data.channel}'


@daily_update_router.post(
    '/get-users',
    dependencies=[Depends(check_slack_auth_du)],
    tags=['DailyUpdate'],
)
async def get_user_from_channel(request: Request) -> str:
    data = SlackSlashRequest.parse_obj(await request.form())

    if not data.text:
        channel_id = data.channel_id
        channel_name = data.channel_name

    if data.text and '|' in data.text:
        channel_id, channel_name = re.findall(r'[\-A-Za-z0-9]+', data.text)

    try:
        users = await UserInChannel.get_by_channel_id(channel_id=channel_id)
        user_info = [await User.get_by_slack_id(slack_id=str(user.slack_id)) for user in users]
        usernames = []
        for user in user_info:
            if not user:
                continue
            usernames.append(user.slack_name)
        return f'The following are the users in channel {channel_name}: {usernames}'
    except Exception as e:
        logger.error(e)
    return 'Error fetching users in channel'


@daily_update_router.post(
    '/role',
    dependencies=[Depends(check_auth)],
    tags=['DailyUpdate'],
)
async def add_role(role: Role):
    try:
        await role.save()
    except Exception as e:
        logger.error(e)


@daily_update_router.get(
    '/roles',
    dependencies=[Depends(check_auth)],
    response_model=List[Role],
    tags=['DailyUpdate'],
)
async def get_roles() -> Optional[List[Role]]:
    try:
        await Role.all().to_list()
    except Exception as e:
        logger.error(e)
    return None


@daily_update_router.post(
    '/trigger_message',
    dependencies=[Depends(check_auth)],
    tags=['DailyUpdate'],
)
async def trigger_message_api():
    """
    Used to manually trigger the daily update message for a user.
    """
    try:
        await trigger_message()
    except Exception as e:
        logger.error(e)


@daily_update_router.post(
    '/channel/{channel_id}',
    dependencies=[Depends(check_auth)],
    tags=['DailyUpdate'],
)
async def add_channel(channel_id: str):
    """
    Adds the users from a channel to the database. And sets the channel to be
    the output.
    """
    channel_info = await slack_app.client.conversations_info(channel=channel_id)
    channel_users = await slack_app.client.conversations_members(channel=channel_id)

    # Add the channel if it does not already exist
    try:
        channel_name = channel_info['channel']['name']
        await Channel.find_one({'channel_id': channel_id}).upsert(
            Set({Channel.channel_name: channel_name}),
            on_insert=Channel(channel_id=channel_id, channel_name=channel_name),
        )

    except Exception as e:
        logger.error(e)
        return

    # Add all current members if they do not already exist
    try:
        users = await User.all().to_list()
        user_ids = [r.slack_id for r in users]
        users_in_channel = await UserInChannel.get_by_channel_id(channel_id)
        users_in_channel_ids = [r.slack_id for r in users_in_channel]
        for member_id in channel_users['members']:
            if member_id not in user_ids:
                user_info = RequestResponseBody.parse_obj(
                    (await slack_app.client.users_info(user=member_id)).data
                )
                if user_info.user:
                    await User(slack_id=member_id, slack_name=user_info.user.name).save()
            if member_id not in users_in_channel_ids:
                await UserInChannel(
                    slack_id=member_id,
                    channel_id=channel_id,
                ).save()
    except Exception as e:
        logger.error(e)


@daily_update_router.get(
    '/channels',
    dependencies=[Depends(check_auth)],
    response_model=List[Channel],
    tags=['DailyUpdate'],
)
async def get_channels():
    """
    Returns all channels in the database.
    """
    try:
        channels = await Channel.all().to_list()
        return channels
    except Exception as e:
        logger.error(e)


@daily_update_router.get(
    '/channel/{channel_id}/users',
    dependencies=[Depends(check_auth)],
    response_model=List[UserInChannel],
    tags=['DailyUpdate'],
)
async def get_channel_users(channel_id: str):
    """
    Gets the users for a channel
    """
    try:
        users = await UserInChannel.get_by_channel_id(channel_id=channel_id)
        return users
    except Exception as e:
        logger.error(e)
