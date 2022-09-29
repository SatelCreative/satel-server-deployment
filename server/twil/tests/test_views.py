import datetime

import pytest

from twil.timing import get_quarter

params = [
    # year, month, day, expected_quarter
    (2021, 1, 31, 0),
    (2021, 3, 31, 0),
    (2021, 4, 30, 1),
    (2021, 6, 30, 1),
    (2021, 7, 31, 2),
    (2021, 9, 30, 2),
    (2021, 12, 31, 3),
    (2021, 1, 1, 0),
    (2021, 3, 1, 0),
    (2021, 4, 1, 1),
    (2021, 6, 1, 1),
    (2021, 7, 1, 2),
    (2021, 9, 1, 2),
    (2021, 12, 1, 3),
]


@pytest.mark.parametrize(
    'date, expected_quarter',
    [
        (
            datetime.datetime(year, month, day),
            quarter,
        )
        for year, month, day, quarter in params
    ],
    ids=[f'{year}/{month}/{day}' for year, month, day, _ in params],
)
@pytest.mark.asyncio
async def test_get_quarter_months(
    date: datetime.datetime,
    expected_quarter: int,
):
    quarters = [datetime.date(date.year, month, 1) for month in (1, 4, 7, 10)]
    assert get_quarter(date) == quarters[expected_quarter]
