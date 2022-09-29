from utils.environments import BaseAppEnvironment


class PeerFeedbackEnvironment(BaseAppEnvironment):
    slack_app_user_id: str

    class Config:
        case_sensitive = False
        env_file = 'config.sh'
        env_prefix: str = 'PEER_FEEDBACK_'


environment = PeerFeedbackEnvironment()
