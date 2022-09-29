from typing import Sequence

from slack.message import (
    Actions,
    Block,
    Button,
    CheckboxElement,
    Field,
    Header,
    Input,
    Label,
    Message,
    Option,
    Section,
    Text,
    TextInputElement,
)

from ..constants import (
    ANONYMOUS_CHECKBOX_ACTION_ID,
    ANONYMOUS_CHECKBOX_BLOCK_ID,
    FEEDBACK_GIVING_BEST_PRACTICES_MRKDWN_LINK,
    PEER_FEEDBACK_REQUEST_CREATE_BUTTON_ACTION_ID,
    PEER_FEEDBACK_RESPONSE_SUBMIT_BUTTON_ACTION_ID,
    RESPONSE_INPUT_BLOCK_ID,
    RESPONSE_TEXT_INPUT_ACTION_ID,
    TEAM_FEEDBACK_RESPONSE_SUBMIT_BUTTON_ACTION_ID,
)


def create_reminder() -> Sequence[dict]:
    elements = [
        Button(
            text=Text(text='Yes'),
            style='primary',
            value='trigger_peer_feedback',
            action_id=PEER_FEEDBACK_REQUEST_CREATE_BUTTON_ACTION_ID,
        )
    ]

    message = Message(
        blocks=[
            Header(text=Text(text='Would you like to request feedback from your team?')),
            Actions(elements=elements),
        ]
    )
    return message.format()


def construct_peer_request_message(
    feedback_parameters: str, requester_user_name: str, multiple_recipients: bool
) -> Sequence[dict]:
    header = Header(
        text=Text(
            text=f':pear: {requester_user_name} on your team has requested feedback from you.'
        )
    )
    feedback_parameters_section = Section(text=Text(text=feedback_parameters))
    best_practice_section = Section(
        text=Text(
            text=FEEDBACK_GIVING_BEST_PRACTICES_MRKDWN_LINK,
            type='mrkdwn',
        )
    )
    feedback_response_input = Input(
        block_id=RESPONSE_INPUT_BLOCK_ID,
        element=TextInputElement(multiline=True, action_id=RESPONSE_TEXT_INPUT_ACTION_ID),
        label=Label(text='Response'),
    )
    anonymous_block: Block = Actions(
        block_id=ANONYMOUS_CHECKBOX_BLOCK_ID,
        elements=[
            CheckboxElement(
                options=[
                    Option(
                        text=Field(type='mrkdwn', text='Send as anonymous'),
                        description=Field(type='mrkdwn', text='Send this response anonymously'),
                        value='anonymous',
                    )
                ],
                action_id=ANONYMOUS_CHECKBOX_ACTION_ID,
            )
        ],
    )
    if not multiple_recipients:
        anonymous_block = Section(text=Text(text='You are the only respondent requested.'))

    submit_button = Actions(
        block_id='submit_response_button',
        elements=[
            Button(
                text=Text(text='Submit'),
                style='primary',
                action_id=PEER_FEEDBACK_RESPONSE_SUBMIT_BUTTON_ACTION_ID,
                value='submit_response',
            )
        ],
    )

    message = Message(
        blocks=[
            header,
            feedback_parameters_section,
            best_practice_section,
            feedback_response_input,
            anonymous_block,
            submit_button,
        ]
    )

    return message.format()


def construct_peer_response_message(
    feedback_parameters: str, response_user_name: str, response: str
) -> Sequence[dict]:
    header = Header(
        text=Text(text=f':pear: {response_user_name} on your team has shared feedback with you.')
    )
    feedback_parameters_title_section = Section(
        text=Text(
            text='*Your Feedback Parameters:*\n'
            '*Specific areas you were looking to gather feedback on.*',
            type='mrkdwn',
        ),
    )
    feedback_parameters_section = Section(text=Text(text=feedback_parameters))
    response_title_section = Section(
        text=Text(
            text='*Response:*',
            type='mrkdwn',
        ),
    )
    response_section = Section(text=Text(text=response))
    message = Message(
        blocks=[
            header,
            feedback_parameters_title_section,
            feedback_parameters_section,
            response_title_section,
            response_section,
        ]
    )

    return message.format()


def construct_team_request_message(
    feedback_parameters: str, requester_user_name: str, feedback_recipient_name: str
) -> Sequence[dict]:
    header = Header(
        text=Text(
            text=f':mango: {requester_user_name} has requested '
            f'feedback from you for {feedback_recipient_name}'
        )
    )
    feedback_parameters_section = Section(text=Text(text=feedback_parameters))
    best_practice_section = Section(
        text=Text(
            text=FEEDBACK_GIVING_BEST_PRACTICES_MRKDWN_LINK,
            type='mrkdwn',
        )
    )
    feedback_response_input = Input(
        block_id=RESPONSE_INPUT_BLOCK_ID,
        element=TextInputElement(multiline=True, action_id=RESPONSE_TEXT_INPUT_ACTION_ID),
        label=Label(text='Response'),
    )

    submit_button = Actions(
        block_id='submit_response_button',
        elements=[
            Button(
                text=Text(text='Submit'),
                style='primary',
                action_id=TEAM_FEEDBACK_RESPONSE_SUBMIT_BUTTON_ACTION_ID,
                value='submit_response',
            )
        ],
    )

    message = Message(
        blocks=[
            header,
            feedback_parameters_section,
            best_practice_section,
            feedback_response_input,
            submit_button,
        ]
    )

    return message.format()


def construct_team_response_message(
    feedback_parameters: str, response_user_name: str, response: str, recipient_name: str
) -> Sequence[dict]:
    header = Header(
        text=Text(
            text=f':mango: {response_user_name} on your team has shared '
            f'feedback with you for {recipient_name}.'
        )
    )
    feedback_parameters_title_section = Section(
        text=Text(
            text='*Feedback Parameters:*',
            type='mrkdwn',
        ),
    )
    feedback_parameters_section = Section(text=Text(text=feedback_parameters))
    response_title_section = Section(
        text=Text(
            text='*Response:*',
            type='mrkdwn',
        ),
    )
    response_section = Section(text=Text(text=response))
    message = Message(
        blocks=[
            header,
            feedback_parameters_title_section,
            feedback_parameters_section,
            response_title_section,
            response_section,
        ]
    )

    return message.format()
