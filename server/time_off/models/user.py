from sqlalchemy import Column, String

from database import BaseTableModel

from .sqlalchemy_base import Base


class User(BaseTableModel, Base):
    __tablename__ = 'users'
    slackId = Column(String, primary_key=True, index=True)
    slackName = Column(String)
