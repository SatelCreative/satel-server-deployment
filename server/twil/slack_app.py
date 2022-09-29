from typing import Any, Dict

from slack_bolt.async_app import AsyncApp
from slack_sdk.web.async_client import AsyncWebClient

from slack.utils import initialize_slack_app

from .environment import environment
from .views import create_home

slack_app: AsyncApp = initialize_slack_app(environment, 'TWIL')


@slack_app.event('app_home_opened')
async def update_home_tab(event: Dict[str, Any], client: AsyncWebClient, context):
    user = event.get('user')
    if user:
        await client.views_publish(
            # the user that opened your app's app home
            user_id=user,
            # the view object that appears in the app home
            view=create_home(),
        )
