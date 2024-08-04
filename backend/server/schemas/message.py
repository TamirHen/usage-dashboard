from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class Message(BaseModel):
    id: int
    text: str
    timestamp: datetime
    report_id: Optional[int] = None

    # instance method created to encourage future developers to use the same
    # format when converting Message timestamp into string
    def get_timestamp_str(self):
        return self.timestamp.isoformat()


class MessagesResponse(BaseModel):
    messages: list[Message]
