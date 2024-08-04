from typing import Optional

from pydantic import BaseModel


class Usage(BaseModel):
    message_id: int
    timestamp: str
    report_name: Optional[str] = None
    credits_used: float


class UsageResponse(BaseModel):
    usage: list[Usage]
