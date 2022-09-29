from slack.message import (
    Close,
    Input,
    Label,
    Message,
    Modal,
    MultiUserSelectElement,
    Placeholder,
    Section,
    Submit,
    Text,
    TextInputElement,
    Title,
)

from ..constants import (
    FEEDBACK_BEST_PRACTICES_MRKDWN_LINK,
    MEMBERS_SELECT_BLOCK_ID,
    MULTI_MEMBERS_SELECT_ACTION_ID,
    PARAMETERS_INPUT_BLOCK_ID,
    PARAMETERS_TEXT_INPUT_ACTION_ID,
    PEER_FEEDBACK_REQUEST_SUBMIT_CALLBACK_ID,
    RECIPIENT_NAME_INPUT_BLOCK_ID,
    RECIPIENT_NAME_TEXT_INPUT_ACTION_ID,
    TEAM_FEEDBACK_REQUEST_SUBMIT_CALLBACK_ID,
)


def generate_peer_request_modal():
    best_practice_block = Section(
        text=Text(
            text=FEEDBACK_BEST_PRACTICES_MRKDWN_LINK,
            type='mrkdwn',
        )
    )

    team_members_select = Input(
        block_id=MEMBERS_SELECT_BLOCK_ID,
        element=MultiUserSelectElement(
            placeholder=Placeholder(text='Select or type in members'),
            action_id=MULTI_MEMBERS_SELECT_ACTION_ID,
        ),
        label=Label(text='Team Members'),
    )

    feedback_parameters_input = Input(
        block_id=PARAMETERS_INPUT_BLOCK_ID,
        element=TextInputElement(multiline=True, action_id=PARAMETERS_TEXT_INPUT_ACTION_ID),
        label=Label(
            text='Feedback Parameters:\n'
            'Giving your team parameters will make it easier for them '
            'to offer specific feedback on areas you are looking to improve on'
        ),
    )

    message = Message(blocks=[best_practice_block, team_members_select, feedback_parameters_input])

    request_modal = Modal(
        title=Title(text='Peer Feedback Request'),
        callback_id=PEER_FEEDBACK_REQUEST_SUBMIT_CALLBACK_ID,
        blocks=message.format(),
        submit=Submit(text='Submit'),
        close=Close(text='Close'),
    )

    return request_modal.format_json()


def generate_team_request_modal():
    best_practice_block = Section(
        text=Text(
            text=FEEDBACK_BEST_PRACTICES_MRKDWN_LINK,
            type='mrkdwn',
        )
    )

    recipient_name_input = Input(
        block_id=RECIPIENT_NAME_INPUT_BLOCK_ID,
        element=TextInputElement(
            multiline=False,
            action_id=RECIPIENT_NAME_TEXT_INPUT_ACTION_ID,
            placeholder=Placeholder(text='Name'),
        ),
        label=Label(text='Requesting feedback for:'),
    )

    team_members_select = Input(
        block_id=MEMBERS_SELECT_BLOCK_ID,
        element=MultiUserSelectElement(
            placeholder=Placeholder(text='Select or type in members'),
            action_id=MULTI_MEMBERS_SELECT_ACTION_ID,
        ),
        label=Label(text='Requesting feedback from:'),
    )

    feedback_parameters_input = Input(
        block_id=PARAMETERS_INPUT_BLOCK_ID,
        element=TextInputElement(multiline=True, action_id=PARAMETERS_TEXT_INPUT_ACTION_ID),
        label=Label(text='Message to team:'),
    )

    message = Message(
        blocks=[
            best_practice_block,
            recipient_name_input,
            team_members_select,
            feedback_parameters_input,
        ]
    )

    request_modal = Modal(
        title=Title(text='Team Feedback Request'),
        callback_id=TEAM_FEEDBACK_REQUEST_SUBMIT_CALLBACK_ID,
        blocks=message.format(),
        submit=Submit(text='Submit'),
        close=Close(text='Close'),
    )

    return request_modal.format_json()
