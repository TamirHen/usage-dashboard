import httpx
from httpx import HTTPError

from ..config import settings
from ..schemas.report import Report


async def get_report(report_id: int) -> Report:
    endpoint_url = settings.oc_base_url + settings.oc_reports_path
    try:
        # calling Orbital Witness Report API asynchronously to allow fetching
        # multiple reports concurrently
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{endpoint_url}/{report_id}")
            response.raise_for_status()
            json = response.json()
            report = Report.model_validate(json)
    except HTTPError as err:
        raise HTTPError(f"Report with id {report_id} not found") from err
    except ValueError as err:
        raise ValueError(f"Unexpected json returned from {endpoint_url} for report {report_id}") from err
    except Exception as err:
        raise Exception(f"Unexpected error occurred: {str(err)}") from err

    return report
