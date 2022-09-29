from __future__ import annotations

import functools
from typing import Any, List

import bcrypt
from pydantic import SecretStr
from sqlalchemy import Column, LargeBinary, String, create_engine
from sqlalchemy.engine.base import Engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.session import Session

from .basetable import BaseTableModel

Base: Any = declarative_base()


class Client(BaseTableModel, Base):
    __tablename__ = 'clients'

    client_id = Column(String, index=True, unique=True)
    client_name = Column(String, primary_key=True, unique=True)
    client_secret = Column(LargeBinary)

    @classmethod
    def check_credentials(cls, clientId: str, client_secret: bytes, session: Session) -> bool:
        query = session.query(cls).filter(cls.client_id == clientId).all
        results: List[Client] = cls.query(query, session)
        if len(results) < 1 or not results[0].client_secret:
            return False
        return bcrypt.checkpw(client_secret, results[0].client_secret)

    @classmethod
    def get(cls, clientId: str, session: Session) -> Client:
        query = session.query(cls).filter(cls.client_id == clientId).first
        return cls.query(query, session)

    def create(self, session: Session):
        query = functools.partial(session.merge, self)
        self.query(query, session)
        session.commit()


class AuthDatabase:

    engine: Engine
    SessionMaker: sessionmaker

    def __init__(
        self,
        db_type: str,
        db_username: str,
        db_password: SecretStr,
        db_host: str,
        db_port: str,
        db_name: str,
        *args,
        **kwargs,
    ) -> None:
        self.engine = create_engine(
            (
                f'{db_type}://{db_username}:'
                f'{db_password.get_secret_value()}@{db_host}'
                f':{db_port}/{db_name}'
            )
        )

        # Bind all of the tables together
        Base.metadata.create_all(self.engine)

        self.SessionMaker = sessionmaker(bind=self.engine)

    def get_session(self) -> Session:
        session: Session = self.SessionMaker()
        return session
