from typing import Optional

from pydantic import BaseModel
from pydantic.networks import HttpUrl


class Client(BaseModel):
    client_id: str
    client_name: Optional[str]
    client_secret: bytes

    class Config:
        orm_mode = True


class AccessToken(BaseModel):
    iss: HttpUrl
    exp: int
    nbf: int
    iat: int
    client_id: str
    client_name: str
