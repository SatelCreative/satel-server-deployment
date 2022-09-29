from typing import Any, Dict, List, Optional

from pydantic.main import BaseModel


class Button(BaseModel):
    type: str
    text: str
    emoji: Optional[bool]


class Text(BaseModel):
    type: str
    text: str
    verbatim: Optional[bool]
    emoji: Optional[bool]


class Block(BaseModel):
    type: str
    block_id: str
    text: Optional[Text]


class Metadata(BaseModel):
    """
    Medadata for posting messages
    """

    event_type: str
    event_payload: Dict[str, Any]


class Message(BaseModel):
    bot_id: str
    type: str
    text: str
    user: str
    ts: float
    team: str
    blocks: List[Block]
    metadata: Optional[Metadata]


class SelectedOption(BaseModel):
    text: Text
    value: Any


class ActionDataResponse(BaseModel):
    type: str
    selected_option: Optional[SelectedOption]
    value: Optional[Any]


class TextInput(BaseModel):
    type: str
    value: str


class DropDownSelected(BaseModel):
    text: Text
    value: Any


class DropDown(BaseModel):
    type: str
    selected_option: DropDownSelected


class State(BaseModel):
    values: Dict[
        str,
        Dict[
            str,
            Any,
        ],
    ]


class Action(BaseModel):
    action_id: str
    block_id: str
    text: Optional[Text]
    value: Optional[str]
    type: str
    action_ts: float


class User(BaseModel):
    id: str
    username: str
    name: str
    team_id: str


class Team(BaseModel):
    id: str
    domain: str


class Channel(BaseModel):
    id: str
    name: str


class Container(BaseModel):
    type: str
    channel_id: Optional[str]
    view_id: Optional[str]
    is_ephemeral: Optional[bool]
    message_ts: Optional[float]


class Title(BaseModel):
    type: str
    text: str
    emoji: bool


class View(BaseModel):
    id: str
    team_id: str
    type: str
    blocks: List[Block]
    private_metadata: str
    callback_id: str
    state: Optional[State]
    hash: str
    title: Title
    clear_on_close: bool
    notify_on_close: bool
    close: Optional[Button]
    submit: Optional[Button]
    previous_view_id: Optional[str]
    root_view_id: str
    app_id: str
    external_id: str
    app_installed_team_id: str
    bot_id: str


class ActionResponseBody(BaseModel):
    """
    This is the response provided by the app actions from slack.
    """

    type: str
    api_app_id: str
    token: str
    trigger_id: str
    is_enterprise_install: bool

    user: User
    team: Team

    container: Optional[Container]
    enterprise: Optional[str]
    view: Optional[View]
    channel: Optional[Channel]
    message: Optional[Message]
    state: Optional[State]
    response_url: Optional[str]
    actions: Optional[List[Action]]
