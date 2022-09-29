from typing import Optional

from beanie import Document, Indexed


class Channel(Document):
    channel_id: Indexed(str)  # type: ignore[valid-type]
    channel_name: str

    @classmethod
    async def get_by_channel_id(self, channel_id: str) -> Optional['Channel']:
        channel = await Channel.find_one(Channel.channel_id == channel_id)
        return channel
