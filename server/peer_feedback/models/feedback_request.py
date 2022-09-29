from datetime import datetime
from typing import List, Optional

from beanie import Document, Indexed


class FeedbackRequest(Document):
    trigger_slack_id: Indexed(str, unique=True)  # type: ignore[valid-type]
    requester_slack_id: Indexed(str)  # type: ignore[valid-type]
    requester_name: str
    respondent_slack_ids: List[str]
    feedback_recipient_name: Optional[str]
    created_at: Indexed(datetime)  # type: ignore[valid-type]
    parameters: str
