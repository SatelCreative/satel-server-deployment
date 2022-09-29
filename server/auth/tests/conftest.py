from asyncio import get_event_loop_policy

import nest_asyncio  # type: ignore
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic.types import SecretStr
from pytest import yield_fixture

from auth.models import Client
from utils.environments import APPEnvironment

nest_asyncio.apply()


@yield_fixture(scope='session')
def event_loop():
    """Prevent errors where two coroutines are in different loops by never closing the loop"""
    loop = get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


environment = APPEnvironment()

environment.db_type = 'mongodb'
environment.db_username = 'username'
environment.db_password = SecretStr('password')
environment.db_host = 'mongo'
environment.db_port = '27017'
environment.db_name = 'authtest'


async def init_test_db() -> None:
    client = AsyncIOMotorClient(f'mongodb://{environment.db_host}:{environment.db_port}')
    mongo = client[environment.db_name]
    await init_beanie(database=mongo, document_models=[Client])  # type: ignore[arg-type]

    await Client(
        client_id=AuthData.client_id,
        client_name=AuthData.client_name,
        client_secret=AuthData.hashed_client_secret,
    ).save()


class AuthData:
    issuer = 'https://slackers.satel.ca'

    client_id = 'fd278174-5805-4048-82a1-f2d8f3015f4f'
    client_secret = (
        'FXHC_huo1QuhIiMNSLlnZ7jCKVZC6-7fUNHPgnChYlcx3p5pcbkxKeBJ2ta3q4FF3KCQHg5K9xy5961Y3-4oag'
    )

    hashed_client_secret = b'$2b$12$WUG9Ehm.PNJUK8j6GCKrD.otAvrxhVisDbQRPa.RZompxhtJ5Y/6u'
    client_name = 'test_client'
    algorithm = 'RS256'
