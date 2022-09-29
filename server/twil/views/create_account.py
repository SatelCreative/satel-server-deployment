def create_account():
    return {
        'title': {'type': 'plain_text', 'text': 'Add Github Account'},
        'submit': {'type': 'plain_text', 'text': 'Submit'},
        'blocks': [
            {
                'type': 'input',
                'block_id': 'github_username',
                'element': {
                    'type': 'plain_text_input',
                    'action_id': 'github_username',
                    'placeholder': {
                        'type': 'plain_text',
                        'text': 'Github Username',
                    },
                },
                'label': {
                    'type': 'plain_text',
                    'text': 'Account to link to your slack',
                },
            },
            {
                'type': 'input',
                'block_id': 'user_group',
                'element': {
                    'type': 'static_select',
                    'placeholder': {
                        'type': 'plain_text',
                        'text': 'Select a team',
                        'emoji': True,
                    },
                    'options': [
                        {
                            'text': {
                                'type': 'plain_text',
                                'text': 'Frontend',
                                'emoji': True,
                            },
                            'value': 'frontend',
                        },
                        {
                            'text': {
                                'type': 'plain_text',
                                'text': 'Backend',
                                'emoji': True,
                            },
                            'value': 'backend',
                        },
                    ],
                    'action_id': 'user_group',
                },
                'label': {
                    'type': 'plain_text',
                    'text': 'Select team',
                    'emoji': True,
                },
            },
        ],
        'type': 'modal',
        'callback_id': 'CreateGithubAccount',
    }
