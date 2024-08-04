import httpx
from httpx import HTTPError

from ..config import settings
from ..schemas.message import Message, MessagesResponse


async def get_current_period_messages() -> list[Message]:
    endpoint_url = settings.oc_base_url + settings.oc_current_period_messages_path
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(endpoint_url)
            response.raise_for_status()
            json = response.json()
            message_response = MessagesResponse.model_validate(json)
    except HTTPError as err:
        raise HTTPError("Error occurred while trying to get messages for the current period") from err
    except ValueError as err:
        raise ValueError(f"Unexpected json returned from {endpoint_url}") from err
    except Exception as err:
        raise Exception(f"Unexpected error occurred: {str(err)}") from err

    return message_response.messages
