from datetime import datetime
from typing import Optional

from beanie import Document, Indexed


class FeedbackResponse(Document):
    request_trigger_slack_id: Indexed(str)  # type: ignore[valid-type]
    respondent_slack_id: Optional[str]
    respondent_name: Optional[str]
    created_at: Indexed(datetime)  # type: ignore[valid-type]
    response: str
    is_anonymous: bool = False
