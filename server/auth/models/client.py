from typing import Optional

import bcrypt
from beanie import Document, Indexed


class Client(Document):
    client_id: Indexed(str)  # type: ignore[valid-type]
    client_name: Indexed(str)  # type: ignore[valid-type]
    client_secret: bytes

    @classmethod
    async def check_credentials(self, client_id: str, client_secret: bytes) -> bool:
        cred = await Client.find_one(Client.client_id == client_id)
        if not cred:
            return False
        return bcrypt.checkpw(client_secret, cred.client_secret)

    @classmethod
    async def get_client(self, client_id: str) -> Optional['Client']:
        return await Client.find_one(Client.client_id == client_id)
