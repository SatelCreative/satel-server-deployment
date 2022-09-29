from __future__ import annotations

from sqlalchemy import create_engine
from sqlalchemy.engine.base import Engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.session import Session

from .environment import environment
from .models.sqlalchemy_base import Base


class TimeOffDatabase:

    engine: Engine
    SessionMaker: sessionmaker

    def get_session(self) -> Session:
        session: Session = self.SessionMaker()
        return session

    def start(self) -> None:
        self.engine = create_engine(
            (
                f'{environment.db_type}'
                f'://{environment.db_username}:'
                f'{environment.db_password.get_secret_value()}'
                f'@{environment.db_host}:'
                f'{environment.db_port}/'
                f'{environment.db_name}'
            )
        )

        # Bind all of the tables together
        Base.metadata.create_all(self.engine)

        self.SessionMaker = sessionmaker(bind=self.engine)


time_off_db = TimeOffDatabase()
