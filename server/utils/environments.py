from logging import warning
from typing import List, Optional

from Crypto.PublicKey import RSA
from pydantic import BaseSettings
from pydantic.class_validators import root_validator
from pydantic.networks import HttpUrl
from pydantic.types import SecretStr

from .constants import DUMMYTOKEN


class BaseEnvironment(BaseSettings):
    db_type: str
    db_username: str
    db_password: SecretStr
    db_host: str
    db_port: str
    db_name: str


class BaseAppEnvironment(BaseEnvironment):
    admin: List[str]
    bot_token: str = DUMMYTOKEN
    signing_secret: SecretStr = SecretStr('DUMMYSECRET')
    verification_token: str
    client_id: str
    scopes: str
    slack_chat_channel: str
    app_name: str

    @property
    def is_configured(self):
        return self.bot_token != DUMMYTOKEN and self.signing_secret != 'DUMMYSECRET'

    @root_validator
    def check_token_and_secret(cls, values: dict):
        name = values.get('app_name') or 'UKNOWN APP'
        if not values.get('bot_token') or not values['signing_secret']:
            # set defaults here as passing an empty value in config.sh overwrites
            # default to empty string
            values['bot_token'] = DUMMYTOKEN
            values['signing_secret'] = SecretStr('DUMMYSECRET')
            warning(
                f'{name} is not configured properly. '
                'The Slack app was initialized with dummy values.'
            )
        return values


class APPEnvironment(BaseEnvironment):
    development: bool = False
    public_key: Optional[bytes]
    private_key: Optional[bytes]
    username: str
    password: str
    url: HttpUrl

    @root_validator
    def generate_keys(cls, values):
        private_key = values.get('private_key')
        if not private_key:
            key = RSA.generate(2048)
            values['public_key'] = key.public_key().export_key()
            values['private_key'] = key.export_key()
        return values

    class Config:
        case_sensitive = False
        env_file = 'config.sh'
        env_prefix: str = 'APP_'


environment = APPEnvironment()
