from utils.environments import BaseAppEnvironment


class RecognitionEnvironment(BaseAppEnvironment):
    main_channel: str
    day_of_week_reminder: str = 'fri'
    count_per_page: int

    class Config:
        case_sensitive = False
        env_file = 'config.sh'
        env_prefix: str = 'RECOGNITION_'


environment = RecognitionEnvironment()
