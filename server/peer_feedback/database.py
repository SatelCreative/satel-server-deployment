from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from .environment import environment
from .models import FeedbackRequest, FeedbackResponse


async def init_db() -> None:
    client = AsyncIOMotorClient(f'mongodb://{environment.db_host}:{environment.db_port}')
    mongo = client[environment.db_name]
    await init_beanie(
        database=mongo,
        document_models=[FeedbackRequest, FeedbackResponse],  # type: ignore[arg-type]
    )
