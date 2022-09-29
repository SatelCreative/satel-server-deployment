from typing import Optional

from pydantic.main import BaseModel
from pydantic.networks import AnyHttpUrl, HttpUrl


class UserProfile(BaseModel):
    first_name: str
    last_name: str
    title: str
    phone: str
    skype: str
    real_name: str
    real_name_normalized: str
    display_name: str
    display_name_normalized: str
    fields: None
    status_text: str
    status_emoji: str
    status_expiration: int
    avatar_hash: str
    status_text_canonical: str
    team: str
    is_custom_image: Optional[bool]
    image_original: Optional[AnyHttpUrl]
    image_24: Optional[AnyHttpUrl]
    image_32: Optional[AnyHttpUrl]
    image_48: Optional[AnyHttpUrl]
    image_72: Optional[AnyHttpUrl]
    image_192: Optional[AnyHttpUrl]
    image_512: Optional[AnyHttpUrl]
    image_1024: Optional[AnyHttpUrl]


class User(BaseModel):
    id: str
    team_id: str
    name: str
    deleted: bool
    color: str
    real_name: str
    tz: str
    tz_label: str
    tz_offset: int
    is_admin: bool
    is_owner: bool
    is_primary_owner: bool
    is_restricted: bool
    is_ultra_restricted: bool
    is_bot: bool
    is_app_user: bool
    updated: int
    is_email_confirmed: bool
    who_can_share_contact_card: str

    profile: UserProfile


class RequestResponseBody(BaseModel):
    ok: bool
    user: Optional[User]


class SlackSlashRequest(BaseModel):
    token: str
    team_id: str
    team_domain: str
    enterprise_id: Optional[str]
    enterprise_name: Optional[str]
    channel_id: str
    channel_name: str
    user_id: str
    user_name: str
    command: str
    text: str = ''
    response_url: HttpUrl
    trigger_id: str
    api_app_id: str
