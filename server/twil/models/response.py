from typing import Any, Optional

from pydantic import BaseModel


class Response(BaseModel):
    description: Optional[str]
    body: Optional[Any]
