from typing import Sequence

from recognition.constants import BEST_PRACTICES_TEXT
from slack.message import Actions, Button, Header, Message, Section, Text


def recognition_message(message: str, sender: str, is_anonymous: bool) -> Sequence[dict]:
    header = 'Someone sent you a recognition!'
    if not is_anonymous:
        header = f'{sender} sent you a recognition!'

    message_block = Message(
        blocks=[Header(text=Text(text=header)), Section(text=Text(text=f'{message}'))]
    )

    return message_block.dict(exclude_none=True)['blocks']


def create_reminder(user: str) -> Sequence[dict]:
    elements = [
        Button(
            text=Text(text='Send Recognition'),
            style='primary',
            value='trigger_recognition',
            action_id='create_recognition',
        )
    ]

    message = Message(
        blocks=[
            Header(text=Text(text=':star2: Recognition Reminder')),
            Section(text=Text(type='mrkdwn', text=BEST_PRACTICES_TEXT)),
            Actions(elements=elements),
        ]
    )

    final_message = message.dict(exclude_none=True)
    final_message['blocks'][2]['elements'] = [
        Button(
            text=Text(text='Send Recognition'),
            style='primary',
            value='trigger_recognition',
            action_id='create_recognition',
        ).dict(exclude_none=True)
    ]

    return final_message['blocks']
