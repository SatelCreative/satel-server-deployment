from utils.environments import environment

from .server import JWTBearer

jwt_authentication: JWTBearer

if environment.public_key and environment.private_key:
    jwt_authentication = JWTBearer(
        public_key=environment.public_key.decode(),
        private_key=environment.private_key.decode(),
        issuer=environment.url,
    )
