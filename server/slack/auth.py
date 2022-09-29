import datetime
import hashlib
import hmac

from fastapi import HTTPException, Request
from starlette import status


async def check_slack_auth(request: Request, secret: str):
    timestamp = request.headers['X-Slack-Request-Timestamp']

    if abs(int(datetime.datetime.now().timestamp()) - int(timestamp)) > 60 * 5:
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            'Time in request is invalid.',
        )

    body = await request.body()
    sig_basestring = b'v0:' + bytes(timestamp, 'utf-8') + b':' + body
    signature = (
        'v0='
        + hmac.new(
            bytes(secret, 'utf-8'),
            sig_basestring,
            hashlib.sha256,
        ).hexdigest()
    )

    slack_signature = request.headers['X-Slack-Signature']

    if not hmac.compare_digest(signature, slack_signature):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "HMAC doesn't match")
    return
