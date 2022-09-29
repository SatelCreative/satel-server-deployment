from datetime import datetime

from beanie import Document, Indexed


class Vote(Document):
    voter_slack_id: Indexed(str)  # type: ignore[valid-type]
    votee_slack_id: Indexed(str)  # type: ignore[valid-type]
    created_at: datetime
