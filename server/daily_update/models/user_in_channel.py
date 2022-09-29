from typing import List, Optional

from beanie import Document, Indexed


class UserInChannel(Document):
    slack_id: Indexed(str)  # type: ignore[valid-type]
    channel_id: Indexed(str)  # type: ignore[valid-type]

    @classmethod
    async def remove_user_from_channel(
        self,
        slack_id: str,
        channel_id: str,
    ) -> None:
        user_in_channel = await self.get_by_slack_and_channel_id(
            slack_id,
            channel_id,
        )
        if user_in_channel:
            await user_in_channel.delete()

    @classmethod
    async def get_by_channel_id(
        self,
        channel_id: str,
    ) -> List['UserInChannel']:
        users = await UserInChannel.find(UserInChannel.channel_id == channel_id).to_list()
        return users

    @classmethod
    async def get_by_slack_id(
        self,
        slack_id: str,
    ) -> List['UserInChannel']:
        channels = await UserInChannel.find(UserInChannel.slack_id == slack_id).to_list()
        return channels

    @classmethod
    async def get_by_slack_and_channel_id(
        self,
        slack_id: str,
        channel_id: str,
    ) -> Optional['UserInChannel']:
        user = await UserInChannel.find(
            {'slack_id': slack_id, 'channel_id': channel_id}
        ).first_or_none()
        return user
