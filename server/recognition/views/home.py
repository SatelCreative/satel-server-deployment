from typing import List, Optional

from recognition.constants import BEST_PRACTICES_TEXT, CONFLUENCE_LINK
from recognition.models import Recognition
from slack.message import (
    Accessory,
    Divider,
    Homepage,
    Placeholder,
    Section,
    SelectOption,
    StaticSelect,
    Text,
)


def generate_page_options(total_pages: int) -> List[SelectOption]:
    options = []
    for page in range(1, total_pages + 1):
        option = SelectOption(
            text=Text(type='plain_text', text=f'{page}', emoji=True), value=f'{page}'
        )
        options.append(option)
    return options


async def create_home(
    recognitions: Optional[List[Recognition]], total_pages: int, page: int = 1
) -> dict:
    """
    Generates the homepage for the slack page
    """
    send_recognition_section = Section(
        text=Text(type='mrkdwn', text=':star2: Send someone a recognition! :smile:'),
        accessory=Accessory(
            type='button',
            text=Text(text='Send Recognition'),
            value='trigger_recognition',
            action_id='create_recognition',
        ),
    )

    dropdown_page_section = Section(
        text=Text(type='mrkdwn', text='Select a page to view previous recognitions'),
        accessory=StaticSelect(
            placeholder=Placeholder(type='plain_text', text=f'{page}', emoji=True),
            options=generate_page_options(total_pages=total_pages),
            action_id='select_page',
        ),
    )

    blocks = [
        Section(text=Text(type='mrkdwn', text=':star2: *Recognition Reminder*')),
        Divider(),
        Section(text=Text(type='mrkdwn', text=BEST_PRACTICES_TEXT + CONFLUENCE_LINK)),
        Divider(),
    ]

    if recognitions:
        recognitions_text = f':star2: *Viewing recognitions of page {page} *\n'
        for recognition in recognitions:
            recognitions_text += (
                f'\n:small_blue_diamond: {recognition.sender_name}: {recognition.message}'
            )
        previous_recognitions_section = Section(text=Text(type='mrkdwn', text=recognitions_text))
        blocks.append(previous_recognitions_section)
        blocks.append(dropdown_page_section)
        blocks.append(Divider())

    blocks.append(send_recognition_section)
    return Homepage(blocks=blocks).format()
