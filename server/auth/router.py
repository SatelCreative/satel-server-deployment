from secrets import compare_digest

from fastapi import Depends, Form
from fastapi.routing import APIRouter
from fastapi.security.http import HTTPBasic, HTTPBasicCredentials
from starlette.exceptions import HTTPException
from starlette.responses import JSONResponse
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_401_UNAUTHORIZED

from auth.exceptions import InvalidClient
from auth.jwt import jwt_authentication
from utils.environments import environment

security = HTTPBasic()


def login(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = compare_digest(
        credentials.username,
        environment.username,
    )
    correct_password = compare_digest(
        credentials.password,
        environment.password,
    )
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=HTTP_401_UNAUTHORIZED,
            detail='Incorrect username or password',
        )
    return


auth_routes = APIRouter()


@auth_routes.get(
    '/auth/credentials/{client_name}',
    include_in_schema=True,
    dependencies=[Depends(login)],
    tags=['OAuth'],
)
async def get_credentials(client_name: str):
    """Generates the client `id` and `secret` for an application."""
    credentials = await jwt_authentication.generate_credentials(client_name)
    return {'credentials': credentials}


@auth_routes.post(
    '/auth/token',
    include_in_schema=True,
    tags=['OAuth'],
)
async def get_token(client_id: str = Form(...), client_secret: str = Form(...)):
    """Checks the client `id` and `secret` and returns a token."""

    try:
        await jwt_authentication.authenticate_client(client_id, client_secret.encode('utf-8'))
    except InvalidClient:
        return HTTPException(
            HTTP_400_BAD_REQUEST,
            detail='Invalid client `secret`/`id` combo.',
        )

    token = await jwt_authentication.generate_access_token(client_id)
    return JSONResponse({'access_token': token, 'token_type': 'Bearer'})
