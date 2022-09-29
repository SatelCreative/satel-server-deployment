from utils.environments import BaseAppEnvironment


class DailyUpdateEnvironment(BaseAppEnvironment):
    allow_multiple_updates: bool = False

    class Config:
        case_sensitive = False
        env_file = 'config.sh'
        env_prefix: str = 'DAILY_UPDATE_'


environment = DailyUpdateEnvironment()
