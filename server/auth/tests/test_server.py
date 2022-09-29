import jwt
import pytest

from ..server import InvalidClient, JWTBearer
from .conftest import AuthData, environment, init_test_db


@pytest.fixture
def token_handler() -> JWTBearer:
    if not environment.private_key or not environment.public_key:
        raise ValueError('Environment not defined')

    return JWTBearer(
        public_key=environment.public_key.decode(),
        private_key=environment.private_key.decode(),
        issuer=AuthData.issuer,
    )


@pytest.mark.parametrize(
    'life_span, expected',
    [(None, 300), (100, 100)],
    ids=['No Provided Lifespan', 'Provided Lifespan'],
)
@pytest.mark.asyncio
async def test_JWTBearer(life_span: int, expected: int):

    if not environment.public_key or not environment.private_key:
        raise ValueError('Error in the environment variables')

    if life_span:
        token_handler = JWTBearer(
            public_key=environment.public_key.decode(),
            private_key=environment.private_key.decode(),
            issuer=AuthData.issuer,
            life_span=life_span,
        )
    else:
        token_handler = JWTBearer(
            public_key=environment.public_key.decode(),
            private_key=environment.private_key.decode(),
            issuer=AuthData.issuer,
        )

    assert token_handler.issuer == AuthData.issuer
    assert token_handler.algorithm == AuthData.algorithm
    assert token_handler.private_key == environment.private_key.decode()
    assert token_handler.public_key == environment.public_key.decode()
    assert token_handler.life_span == expected


@pytest.mark.asyncio
async def test_generate_credentials():
    await init_test_db()
    token_handler = JWTBearer(
        public_key=environment.public_key,
        private_key=environment.private_key,
        issuer=AuthData.issuer,
    )

    client = await token_handler.generate_credentials(AuthData.client_name)
    assert client.client_name == AuthData.client_name
    assert client.client_id
    assert client.client_secret
    assert isinstance(client.client_secret, bytes)


@pytest.mark.asyncio
async def test_authenticate_client(token_handler: JWTBearer):
    assert await token_handler.authenticate_client(
        client_id=AuthData.client_id,
        client_secret=AuthData.client_secret.encode('utf-8'),
    )


@pytest.mark.parametrize(
    'client_id, client_secret',
    [
        (None, None),
        (None, b'invalid-secret'),
        ('invalid-id', None),
        ('invalid-id', b'invalid-secret'),
        (AuthData.client_id, b'invalid-secret'),
        ('invalid-id', AuthData.client_secret),
    ],
    ids=[
        'No ID & No Secret',
        'No ID',
        'No Secret',
        'Invalid Secret',
        'Invalid ID',
        'Invalid Secret and ID',
    ],
)
@pytest.mark.asyncio
async def test_authenticate_client_fail(
    client_id: str,
    client_secret: bytes,
    token_handler: JWTBearer,
):
    await init_test_db()
    with pytest.raises(InvalidClient):
        await token_handler.authenticate_client(
            client_id=client_id,
            client_secret=client_secret,
        )


@pytest.mark.asyncio
async def test_access_token(
    token_handler: JWTBearer,
):
    await init_test_db()
    token = await token_handler.generate_access_token(AuthData.client_id)

    if not environment.public_key:
        raise ValueError('Environment variables not set.')

    decoded_token = jwt.decode(
        token,
        environment.public_key.decode('utf-8'),
        issuer=AuthData.issuer,
        algorithms=[token_handler.algorithm],
    )
    assert decoded_token['iss'] == AuthData.issuer
    assert decoded_token['client_id'] == AuthData.client_id
    assert decoded_token['client_name'] == AuthData.client_name
    assert token_handler.verify_access_token(token)
