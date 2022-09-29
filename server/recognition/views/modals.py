from typing import Optional

from slack.message import (
    Actions,
    CheckboxElement,
    Close,
    Field,
    Input,
    Label,
    Modal,
    Option,
    Placeholder,
    Section,
    Submit,
    Text,
    TextInputElement,
    Title,
    UserSelectElement,
)


def generate_recognition_modal(error: Optional[str] = None):
    user_block = Input(
        block_id='recipient',
        label=Label(text='Who would you like to send recognition to?'),
        element=UserSelectElement(
            action_id='users_select-action', placeholder=Placeholder(text='Select a user')
        ),
    )

    message_block = Input(
        block_id='message',
        element=TextInputElement(multiline=True, action_id='message'),
        label=Label(text='What would you like to recognize them for?'),
    )

    anonymous_block = Actions(
        block_id='anonymous',
        elements=[
            CheckboxElement(
                options=[
                    Option(
                        text=Field(type='mrkdwn', text='Send as anonymous'),
                        description=Field(
                            type='mrkdwn', text='Send this recognition as anonymous'
                        ),
                        value='anonymous',
                    )
                ],
                action_id='check_anonymous',
            )
        ],
    )

    recognition_modal = Modal(
        title=Title(text='Send Recognition'),
        callback_id='submit_recognition',
        blocks=[user_block, message_block, anonymous_block],
        submit=Submit(text='Submit'),
        close=Close(text='Close'),
    )

    if error:
        recognition_modal.callback_id = ''
        recognition_modal.submit = None
        recognition_modal.blocks = [Section(text=Text(text=error)).dict(exclude_none=True)]

    return recognition_modal.format_json()
