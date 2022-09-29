from utils.environments import BaseAppEnvironment


class TimeOffEnvironment(BaseAppEnvironment):
    class Config:
        case_sensitive = False
        env_file = 'config.sh'
        env_prefix: str = 'TIME_OFF_'


environment = TimeOffEnvironment()
