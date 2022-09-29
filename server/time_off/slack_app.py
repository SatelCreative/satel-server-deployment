from typing import Any, Dict

from loguru import logger
from slack_bolt.async_app import AsyncApp
from slack_bolt.context.ack.async_ack import AsyncAck
from slack_sdk.web.async_client import AsyncWebClient
from sqlalchemy import exc

from slack.body import ActionResponseBody
from slack.utils import initialize_slack_app
from time_off.environment import environment
from utils import environment as app_env

from .database import time_off_db
from .views import create_home, generate_personal_time_off_modal

slack_app: AsyncApp = initialize_slack_app(environment=environment, app_name='TIME OFF')


@slack_app.use
async def db_session_middleware(client, context, payload, next):
    """
    Slack Bolt doesn't support Dependencies, we need to create middleware instead.
    """
    session = time_off_db.get_session()
    try:
        context['session'] = session
        await next()
    except exc.DatabaseError as e:
        message = str(e.__cause__)
        if not app_env.development:
            message = 'Database Error'
        logger.error(message)
    finally:
        session.close()


@slack_app.event('app_home_opened')
async def update_home_tab(
    event: Dict[str, Any],
    client: AsyncWebClient,
    context,
):
    # session: Session = context['session']
    await client.views_publish(
        # the user that opened your app's app home
        user_id=event['user'],
        # the view object that appears in the app home
        view=create_home(event['user']),
    )


@slack_app.action('create_personal_time_off')
async def create_personal_time_off_action(
    ack: AsyncAck,
    body: Dict[str, Any],
    client: AsyncWebClient,
):
    parsed_body = ActionResponseBody.parse_obj(body)
    await client.views_open(
        trigger_id=parsed_body.trigger_id,
        view=generate_personal_time_off_modal(),
    )


@slack_app.view('submit_personal_time_off')
async def handle_submit_personal_time_off(
    ack: AsyncAck,
    body: Dict[str, Any],
    context,
):
    # Comment unused variables for now as linting will fail
    # session: Session = context['session']
    # parsed_body = ActionResponseBody.parse_obj(body)
    # if parsed_body.view and parsed_body.view.state:
    #     form_data = parsed_body.view.state.values
    # reason = form_data['reason']['value']
    # users = form_data['requestees']['selected_users']
    # request = RequestResponseBody.parse_obj(
    # (await app.client.users_info(user=parsed_body.user.id)).data
    # )

    # TODO: save received data to the database

    await ack()
