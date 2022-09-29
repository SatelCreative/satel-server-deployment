from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from .environment import environment
from .models import Channel, DailyUpdate, Role, User, UserInChannel


async def init_db() -> None:
    # initialize collections
    client = AsyncIOMotorClient(f'mongodb://{environment.db_host}:{environment.db_port}')
    mongo = client[environment.db_name]
    await init_beanie(
        database=mongo,
        document_models=[
            Channel,
            DailyUpdate,
            Role,
            User,
            UserInChannel,
        ],  # type: ignore[arg-type]
    )

    # initialize roles
    existing = await Role.all().to_list()
    if not existing:
        role = Role(
            role_name='Regular User',
            role_description='This is a regular user,' + 'they can post and view their own posts.',
        )
        role_admin = Role(
            role_name='Admin User',
            role_description='This is an admin, they can run advanced commands.',
        )
        await role.save()
        await role_admin.save()
