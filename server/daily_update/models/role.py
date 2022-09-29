from beanie import Document


class Role(Document):
    role_name: str
    role_description: str
