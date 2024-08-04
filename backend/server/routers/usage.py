from fastapi import APIRouter

from ..schemas.usage import UsageResponse
from ..services.usage import get_current_period_usage

router = APIRouter(
    prefix="/usage",
    tags=["Usage"],
)


# 'response_model_exclude_none' set to True to omit the field 'report_name' if it is 'None'
@router.get("", response_model=UsageResponse, response_model_exclude_none=True)
async def current_period_usage():
    usage = await get_current_period_usage()
    return UsageResponse(
        usage=usage
    )
