from pydantic import BaseModel


class LanguageResponse(BaseModel):
    id: int
    code: str
    name: str
    native_name: str

    model_config = {
        "from_attributes": True
    }