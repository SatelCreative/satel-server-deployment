from typing import Any, Dict, List, Literal, Optional, Union

from pydantic import BaseModel
from pydantic import Field as PydanticField
from typing_extensions import Annotated


class Title(BaseModel):
    """
    Title of a message
    """

    text: str
    type: str = 'plain_text'
    emoji: bool = True


class Submit(BaseModel):
    """
    For defining the action that happens when a modal is opened.
    """

    text: str
    type: str = 'plain_text'
    emoji: bool = True


class Close(Submit):
    """
    For defining the action that happens when a modal is closed.
    """


class Text(BaseModel):
    """
    Regular text element for slack.
    """

    text: str
    type: str = 'plain_text'


class Header(BaseModel):
    """Creates a header display block in slack"""

    type: Literal['header'] = 'header'
    text: Text


class Field(BaseModel):
    type: str
    text: str


class Divider(BaseModel):
    type: Literal['divider'] = 'divider'


class Accessory(BaseModel):
    type: str
    text: Text
    value: str
    action_id: str


class Section(BaseModel):
    """
    This is a section
    """

    fields: Optional[List[Field]] = None
    text: Optional[Text] = None
    type: Literal['section'] = 'section'
    accessory: Optional[Any] = None


class Button(BaseModel):
    text: Text
    style: str
    value: str
    action_id: Optional[str] = None
    type: str = 'button'


class Option(BaseModel):
    text: Field
    description: Field
    value: str


class CheckboxElement(BaseModel):
    type: str = 'checkboxes'
    options: List[Option]
    action_id: Optional[str]


class Actions(BaseModel):
    elements: List[Any]
    type: Literal['actions'] = 'actions'
    block_id: Optional[str]


class Placeholder(BaseModel):
    text: str
    emoji: bool = True
    type: str = 'plain_text'


class SelectOption(BaseModel):
    text: Text
    value: str


class StaticSelect(BaseModel):
    type: Literal['static_select'] = 'static_select'
    placeholder: Placeholder
    options: List[SelectOption]
    action_id: str


class TextInputElement(BaseModel):
    multiline: bool
    action_id: str
    type: str = 'plain_text_input'


class Label(Text):
    """
    A label, often used within an input block
    """

    type: str = 'plain_text'
    text: str


class UserSelectElement(BaseModel):
    placeholder: Placeholder
    action_id: str
    type: str = 'users_select'


class MultiUserSelectElement(BaseModel):
    placeholder: Placeholder
    action_id: str
    type: str = 'multi_users_select'


class Input(BaseModel):
    block_id: str
    element: Union[TextInputElement, MultiUserSelectElement]
    label: Label
    type: Literal['input'] = 'input'
    optional: bool = False


Block = Annotated[
    Union[Divider, Header, Section, Actions, Input], PydanticField(discriminator='type')
]


class Message(BaseModel):
    """
    Message is the standard format for sending a message in slack. It contains
    a list of blocks, which are rendered on submission with the Bolt API.
    """

    blocks: List[Block]

    def format(self) -> List[Dict]:
        """

        This is a hellish function because the slack API sucks. It defines that
        a properly formatted message has an attribute called `blocks` but when
        you pass this to the API it freaks out because it's only expecting the
        contents of `blocks`.

        It also freaks out if you pass null anywhere. So this saves you from
        that mistake.
        """
        dict_ = self.dict(exclude_none=True)
        return dict_['blocks']


class Modal(BaseModel):
    """
    Modals are a graphical object in Slack. They are similar to a popup form.
    """

    title: Title
    callback_id: str
    submit: Optional[Submit]
    close: Optional[Close]
    blocks: List[Dict]
    type: str = 'modal'

    def format(self) -> dict:
        """Formats the object for the slack API"""
        return self.dict(exclude_none=True)

    def format_json(self) -> str:
        """Formats the object to json for slack API"""
        return self.json(exclude_none=True)


class Homepage(BaseModel):

    blocks: List[Union[Section, Divider]]
    type: str = 'home'

    def format(self) -> dict:
        """Formats the object for the slack API"""
        return self.dict(exclude_none=True)
