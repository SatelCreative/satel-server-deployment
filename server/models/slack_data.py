from re import search

from pydantic import BaseModel


class SlackData(BaseModel):
    user_id: str
    username: str
    channel_id: str = ''
    channel: str = ''

    @classmethod
    def parse(cls, data: str) -> 'SlackData':
        regex_results = search(r'<@([\w]+)\|([-\.\w]+)>\s*<#([\w]+)\|([-\w]+)>', data)
        if not regex_results:
            raise ValueError(f'Could not parse slack data: {data}')

        return SlackData(
            user_id=regex_results.group(1),
            username=regex_results.group(2),
            channel_id=regex_results.group(3),
            channel=regex_results.group(4),
        )

    @classmethod
    def parse_user(cls, data: str) -> 'SlackData':
        regex_results = search(r'<@([\w]+)\|([-\.\w]+)>', data)
        if not regex_results:
            raise ValueError(f'Could not parse slack data: {data}')

        return SlackData(
            user_id=regex_results.group(1),
            username=regex_results.group(2),
        )
