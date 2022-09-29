from typing import Optional

from beanie import Document, Indexed


class User(Document):
    slack_id: Indexed(str)  # type: ignore[valid-type]
    slack_name: str
    role_id: Indexed(int) = 1  # type: ignore[valid-type]

    @classmethod
    async def get_by_slack_id(self, slack_id: str) -> Optional['User']:
        user = await User.find_one(User.slack_id == slack_id)
        return user
