from datetime import datetime
from typing import List, Optional

from beanie import Document, Indexed


class DailyUpdate(Document):
    slack_id: Indexed(str)  # type: ignore[valid-type]
    created_at: Indexed(datetime)  # type: ignore[valid-type]
    update_message: str
    block: Optional[str] = None

    @classmethod
    async def get_by_slack_id(
        self,
        slack_id: str,
    ) -> List['DailyUpdate']:
        updates = await DailyUpdate.find(DailyUpdate.slack_id == slack_id).to_list()
        return updates

    @classmethod
    async def get_by_id_and_date(
        self, slack_id: str, created_at: datetime
    ) -> Optional['DailyUpdate']:
        update = await DailyUpdate.find(
            {'slack_id': slack_id, 'created_at': {'$eq': created_at}}
        ).first_or_none()
        return update

    @classmethod
    async def get_by_date_range(
        self,
        slack_id: str,
        start: datetime,
        end: datetime = datetime.today(),
    ) -> List['DailyUpdate']:
        updates = await DailyUpdate.find(
            {
                '$and': [
                    {'slack_id': slack_id},
                    {'created_at': {'$gt': start}},
                    {'created_at': {'$lt': end}},
                ]
            }
        ).to_list()

        return updates
