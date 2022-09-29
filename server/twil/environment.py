from utils.environments import BaseAppEnvironment


class TWILEnvironment(BaseAppEnvironment):
    class Config:
        case_sensitive = False
        env_file = 'config.sh'
        env_prefix: str = 'TWIL_'


environment = TWILEnvironment()
