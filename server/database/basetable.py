from __future__ import annotations

import functools
from typing import Any, Callable, Dict, List, Optional, Type, TypeVar

from sqlalchemy import exc
from sqlalchemy.orm.session import Session

T = TypeVar('T')


class BaseTableModel:
    @classmethod
    def query(cls, query: Callable, session: Session, params: Optional[Dict[str, Any]] = None):
        """Wrapper for functions that handles all DB errors"""
        try:
            if params:
                result = query(params)
            else:
                result = query()
        except exc.DatabaseError:
            session.rollback()
            raise
        return result

    def create(self, session: Session):
        """Creates an instance in the DB of this object"""
        query = functools.partial(session.add, self)
        self.query(query, session)
        session.commit()

    @classmethod
    def get_all(cls: Type[T], session: Session) -> List[T]:
        query = session.query(cls).all
        vals: List[T] = BaseTableModel.query(query, session)
        return vals
