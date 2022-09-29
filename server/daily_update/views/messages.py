from typing import Sequence

from slack.message import Actions, Button, Header, Message, Section, Text


def update_message(update: str, blocks: str) -> Sequence[dict]:
    sections = [
        Header(text=Text(text='What is your plan for today?')),
        Section(text=Text(text=f'{update}')),
    ]

    if blocks:
        sections.extend(
            [
                Header(text=Text(text='Anything blocking your progress?')),
                Section(text=Text(text=f'{blocks}')),
            ]
        )

    message = Message(blocks=sections)
    return message.dict(exclude_none=True)['blocks']


def create_daily_message(user: str) -> Sequence[dict]:
    elements = [
        Button(
            text=Text(text='Create Daily Update'),
            style='primary',
            value='trigger_daily_update',
            action_id='create_update',
        )
    ]
    message = Message(
        blocks=[
            Header(text=Text(text='Daily Update')),
            Section(text=Text(text=f"Hey {user}! It's time for your daily update!")),
            Actions(elements=elements),
        ]
    )

    final_message = message.dict(exclude_none=True)
    final_message['blocks'][2]['elements'] = [
        Button(
            text=Text(text='Create Daily Update'),
            style='primary',
            value='trigger_daily_update',
            action_id='create_update',
        ).dict(exclude_none=True)
    ]

    return final_message['blocks']
