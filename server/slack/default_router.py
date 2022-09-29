from fastapi import Request
from fastapi.routing import APIRouter
from slack_bolt.adapter.fastapi.async_handler import AsyncSlackRequestHandler
from slack_bolt.async_app import AsyncApp

# Handling of required requests for Slack


def init_default_router(slack_app: AsyncApp) -> APIRouter:
    """Create router handling mandatory routes for a slack app"""
    app_handler = AsyncSlackRequestHandler(slack_app)

    default_router = APIRouter(prefix='/slack')

    @default_router.post('/events', include_in_schema=False)
    async def endpoint(req: Request):
        return await app_handler.handle(req)

    @default_router.get('/install', include_in_schema=False)
    async def install(req: Request):
        return await app_handler.handle(req)

    @default_router.get('/oauth_redirect', include_in_schema=False)
    async def oauth_redirect(req: Request):
        return await app_handler.handle(req)

    return default_router
