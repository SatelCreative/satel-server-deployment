from typing import Optional

from slack.message import (
    Close,
    Input,
    Label,
    Modal,
    Section,
    Submit,
    Text,
    TextInputElement,
    Title,
)


def generate_update_modal(error: Optional[str] = None):
    achieve_block = Input(
        block_id='update',
        label=Label(
            text='What are you trying to achieve today?\n\n'
            '(Provide a list of items you will work on with useful '
            'details and the name of the project.)'
        ),
        element=TextInputElement(multiline=True, action_id='update'),
    )

    blockers_block = Input(
        block_id='block',
        element=TextInputElement(multiline=True, action_id='block'),
        label=Label(
            text='Is there anything blocking your progress?\n\n'
            '(Provide a list of blockers with the name of the corresponding '
            'project or leave it blank if you have no blockers.)'
        ),
        optional=True,
    )

    update_modal = Modal(
        title=Title(text='My Daily Update'),
        callback_id='submit_update',
        blocks=[achieve_block.dict(), blockers_block.dict()],
        submit=Submit(text='Add Update'),
        close=Close(text='Close'),
    )

    if error:
        update_modal.callback_id = ''
        update_modal.submit = None
        update_modal.blocks = [Section(text=Text(text=error)).dict(exclude_none=True)]

    return update_modal.format()
