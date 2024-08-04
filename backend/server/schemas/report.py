from pydantic import BaseModel


class Report(BaseModel):
    # all fields of 'Report' are mandatory, to avoid an incomplete report potentially fail silently
    id: int
    name: str
    credit_cost: float
