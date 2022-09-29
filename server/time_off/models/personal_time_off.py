from datetime import datetime

from sqlalchemy import Column, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey
from sqlalchemy.sql.sqltypes import Boolean, Date, Integer

from database import BaseTableModel

from .sqlalchemy_base import Base
from .user import User


class PersonalTimeOff(BaseTableModel, Base):
    __tablename__ = 'personal_time_offs'
    id = Column(Integer, primary_key=True, autoincrement=True)
    createdAt = Column(Date, default=datetime.now)
    isActive = Column(Boolean, unique=False, default=True)
    reason = Column(Text)
    requesterId = Column(String)
    requestee_id = Column(String, ForeignKey('users.slackId'))
    requestees = relationship(User)
