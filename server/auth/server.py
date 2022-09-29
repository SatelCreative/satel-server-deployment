import secrets
import uuid
from datetime import datetime, timedelta

import bcrypt
import jwt
from fastapi.security import HTTPBearer

from auth.models import Client

from .exceptions import InvalidClient
from .types import AccessToken


class JWTBearer(HTTPBearer):

    public_key: str
    private_key: str
    issuer: str
    life_span: int

    algorithm: str = 'RS256'

    def __init__(
        self,
        public_key: str,
        private_key: str,
        issuer: str,
        life_span: int = 300,
    ) -> None:
        self.public_key = public_key
        self.private_key = private_key
        self.issuer = issuer
        self.life_span = life_span

    async def generate_credentials(self, client_name: str) -> Client:
        secret = secrets.token_urlsafe(64).encode('utf-8')
        client = Client(
            client_id=str(uuid.uuid4()),
            client_name=client_name,
            client_secret=bcrypt.hashpw(secret, bcrypt.gensalt(12)),
        )
        await client.save()
        client.client_secret = secret
        return client

    async def authenticate_client(self, client_id: str, client_secret: bytes) -> bool:
        if not client_id or not client_secret:
            raise InvalidClient('The `id` or `secret` for the client is empty')

        if not await Client.check_credentials(client_id, client_secret):
            raise InvalidClient('The `id` or `secret` for the client is invalid')

        return True

    async def generate_access_token(self, client_id: str) -> str:
        client = await Client.get_client(client_id)
        if client:
            payload = AccessToken(
                iss=self.issuer,
                exp=(datetime.now() + timedelta(0, self.life_span)).timestamp(),
                nbf=datetime.now().timestamp(),
                iat=datetime.now().timestamp(),
                client_id=client_id,
                client_name=client.client_name,
            )
            return jwt.encode(payload.dict(), self.private_key, algorithm=self.algorithm)
        return ''

    def verify_access_token(self, access_token: str) -> bool:
        try:
            jwt.decode(
                access_token,
                self.public_key,
                issuer=self.issuer,
                algorithms=[self.algorithm],
            )
        except (
            jwt.exceptions.InvalidTokenError,
            jwt.exceptions.InvalidSignatureError,
            jwt.exceptions.InvalidIssuerError,
            jwt.exceptions.ExpiredSignatureError,
        ):
            return False
        return True
