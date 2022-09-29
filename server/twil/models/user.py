from typing import Optional

from beanie import Document, Indexed


class User(Document):
    slack_id: Indexed(str)  # type: ignore[valid-type]
    github_id: Optional[str] = None
    team: str
    role: str = 'member'
