import asyncio
import re

from .message import get_current_period_messages
from .report import get_report
from ..schemas.report import Report
from ..schemas.usage import Usage
from ..utils.list import is_all_unique
from ..utils.string import is_palindrome

_BASE_RATE = 1.0
_CHAR_COUNT_RATE = 0.05
_SHORT_WORD_RATE = 0.1
_MID_WORD_RATE = 0.2
_LONG_WORD_RATE = 0.3
_VOWEL_RATE = 0.3
_LENGTH_PENALTY_RATE = 5.0

_UNIQUE_WORD_BONUS = 2.0


async def get_current_period_usage() -> list[Usage]:
    current_period_messages = await get_current_period_messages()
    # remove duplicate report ids
    unique_report_ids = set(message.report_id for message in current_period_messages if message.report_id)
    # fetch reports concurrently
    reports_and_errors = await asyncio.gather(
        *[get_report(report_id) for report_id in unique_report_ids],
        return_exceptions=True
    )
    # store reports in a dict for O(1) search and retrieval
    report_map = {report.id: report for report in reports_and_errors if isinstance(report, Report)}
    usage = []
    for message in current_period_messages:
        # timestamp is assigned to a variable to prevent future developers from
        # accidentally changing the timestamp string format only in one place
        timestamp_str = message.get_timestamp_str()
        if message.report_id and message.report_id in report_map:
            usage.append(Usage(
                message_id=message.id,
                timestamp=timestamp_str,
                report_name=report_map[message.report_id].name,
                credits_used=report_map[message.report_id].credit_cost,
            ))
        else:
            usage.append(Usage(
                message_id=message.id,
                timestamp=timestamp_str,
                credits_used=calculate_cost_from_text(message.text),
            ))

    return usage


def calculate_cost_from_text(text: str) -> float:
    cost = _BASE_RATE
    text_length = len(text)
    cost += text_length * _CHAR_COUNT_RATE
    if text_length > 100:
        cost += _LENGTH_PENALTY_RATE

    # split text into a list of words
    words = re.findall(r"[\w'-]+", text)
    for word in words:
        word_length = len(word)
        if word_length < 4:
            cost += _SHORT_WORD_RATE
        elif word_length < 8:
            cost += _MID_WORD_RATE
        else:  # else world_length >=8
            cost += _LONG_WORD_RATE

    # check if every 3rd char is an upper/lower vowel
    for char in text[2::3]:
        if char.lower() in "aeiou":
            cost += _VOWEL_RATE

    if is_all_unique(words):
        # cost should never get below _BASE_RATE, very important for this to be calculated BEFORE the palindrome
        # or else any cost of _BASE_RATE or below will be charged wrongly.
        # Edge case example: text = "madam", _BASE_RATE = 1
        # if calculated after the palindrome the cost would be -0.55 * 2 = -1.1 which will result in a cost of 1 credit
        # if calculated before (as implemented) the cost would never get below 1, and the palindrome
        # will result in a cost of 2 credits
        cost = max(cost - _UNIQUE_WORD_BONUS, _BASE_RATE)

    lower_alphanum = "".join(char for char in text if char.isalnum()).lower()
    if is_palindrome(lower_alphanum):
        cost *= 2

    return round(cost, 2)
