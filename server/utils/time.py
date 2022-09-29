from datetime import datetime, timedelta


def get_last_monday():
    today = datetime.today()
    monday = today - timedelta(days=today.weekday()) - timedelta(days=1)
    # set time to beginning of day
    return datetime.combine(monday, datetime.min.time())


def get_next_sunday():
    today = datetime.today()
    day_shift = (6 - today.weekday()) % 7
    sunday = today + timedelta(days=day_shift)
    return datetime.combine(sunday, datetime.max.time())
