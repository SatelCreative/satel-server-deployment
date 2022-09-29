from datetime import datetime
from typing import List, Optional

from beanie import Document, Indexed

from recognition.environment import environment


class Recognition(Document):
    sender_slack_id: Optional[str]
    recipient_slack_id: Indexed(str)  # type: ignore[valid-type]
    sender_name: Optional[str]
    created_at: Indexed(datetime)  # type: ignore[valid-type]
    message: str

    @classmethod
    async def get_list(cls, recipient_slack_id: str, page: int = 1) -> List['Recognition']:
        """Paginated list. It will return only RECOGNITION_COUNT_PER_PAGE number of items."""
        recognitions = (
            await cls.find(cls.recipient_slack_id == recipient_slack_id)
            .sort(-cls.created_at)
            .skip((page - 1) * environment.count_per_page)
            .limit(environment.count_per_page)
            .to_list()
        )
        return recognitions

    @classmethod
    async def get_total_pages(cls, recipient_slack_id: str) -> int:
        count = await cls.find(cls.recipient_slack_id == recipient_slack_id).count()
        total_pages = int(count / environment.count_per_page)
        if count % environment.count_per_page != 0:
            total_pages += 1
        return total_pages
