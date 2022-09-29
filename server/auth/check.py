from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from starlette.exceptions import HTTPException
from starlette.status import HTTP_401_UNAUTHORIZED

from .jwt import jwt_authentication

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/auth/token')


def check_auth(token=Depends(oauth2_scheme)):
    if not jwt_authentication.verify_access_token(token):
        raise HTTPException(HTTP_401_UNAUTHORIZED, 'Token is invalid.')
    return
