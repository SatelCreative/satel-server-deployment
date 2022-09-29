from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from .environment import environment
from .models import Recognition, Role


async def init_db() -> None:
    client = AsyncIOMotorClient(f'mongodb://{environment.db_host}:{environment.db_port}')
    mongo = client[environment.db_name]
    await init_beanie(
        database=mongo,
        document_models=[Role, Recognition],  # type: ignore[arg-type]
    )

    # initialize roles
    existing = await Role.all().to_list()
    if not existing:
        role = Role(
            role_name='Regular User',
            role_description='This is a regular user',
        )
        role_admin = Role(
            role_name='Admin User',
            role_description='This is an admin, they can run advanced commands.',
        )
        await role.save()
        await role_admin.save()
