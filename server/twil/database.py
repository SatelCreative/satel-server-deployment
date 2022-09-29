from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from .environment import environment
from .models import User, Vote


async def init_db() -> None:
    # initialize collections
    client = AsyncIOMotorClient(f'mongodb://{environment.db_host}:{environment.db_port}')
    mongo = client[environment.db_name]
    await init_beanie(database=mongo, document_models=[User, Vote])  # type: ignore[arg-type]

    # initialize admin users
    for id in environment.admin:
        existing = await User.find(User.slack_id == id).to_list()
        if not existing:
            admin = User(slack_id=id, team='backend', role='admin')
            await admin.save()
