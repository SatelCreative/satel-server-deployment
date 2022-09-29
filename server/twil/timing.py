import datetime
from math import ceil


def get_quarter(today: datetime.datetime) -> datetime.date:
    quarter_num = ceil(today.month / 3.0)
    return datetime.date(today.year, (1 + 3 * (quarter_num - 1)), 1)
