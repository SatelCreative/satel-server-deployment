from typing import Optional

from slack.message import (
    Close,
    Input,
    Label,
    Modal,
    MultiUserSelectElement,
    Placeholder,
    Section,
    Submit,
    Text,
    TextInputElement,
    Title,
)


def generate_personal_time_off_modal(error: Optional[str] = None):
    reason_block = Input(
        block_id='reason',
        label=Label(text='Personal Time Off Reason, Date and Time'),
        element=TextInputElement(multiline=True, action_id='reason'),
    )

    user_select_block = Input(
        block_id='requestees',
        label=Label(text='Users you want to notify'),
        element=MultiUserSelectElement(
            action_id='multi_users_select-action', placeholder=Placeholder(text='Select users')
        ),
    )

    create_modal = Modal(
        title=Title(text='Personal Time Off'),
        callback_id='submit_personal_time_off',
        blocks=[reason_block, user_select_block],
        submit=Submit(text='Create Request'),
        close=Close(text='Close'),
    )

    if error:
        create_modal.callback_id = ''
        create_modal.submit = None
        create_modal.blocks = [Section(text=Text(text=error)).dict()]

    return create_modal.format_json()
