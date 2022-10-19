# hebliz-task

# Task

Set up a REST api for witness reports. The client sends a name related to the case and a
phone number on which they can be contacted for more details.

We need to store all the reports in a file, and we should check the validity of the report.

a) First by checking if there actually is a case with that title in the FBI DB. You can
use the open FBI Most Wanted API: https://www.fbi.gov/wanted/api

b) Second, we should check the validity of the phone number

c) Check and record in the report the country of the client. 

This can be deducted
from their phone number and/or ip address

For phone number validation you can use

• https://github.com/google/libphonenumber and

for IP geolocation maybe

• https://geo.ipify.org/ or any similar services

## Solution 

-Name and phone number in request are sent via request body.

-Report is chosen to be PDF file, but it could be any other file type.

-Data returned from FBI api is mapped to uids (case ids), which can later be user for the other FBI api call which query parameter is that specific uid and that call returns information about that specific case.

-Phone number validation is checked via JavaScript library libphonenumber-js, that checks phone number regexes. If the phone number is valid, then country code can be extracted from it, only if phone number is in the format that contains country code (E.164).


-GeoIpfy api returns data extracted from request's IP address, and it also gives information about country code.

## Notes

-Clients' request parameters could be sent via query parameters too.

-API is checking only if name and phone number are sent, but it can also return BadRequest if phone number is not valid and not generate PDF.

-Empty FBI data will create report that contains no case ids, but it can also return BedRequest if needed.

-Phone number input can be forced to be in country-supported format (returning BedRequest if not sent in specific format), so it can be easily extracted, with no need for calling GeoIpfy api.

-PDF file can also contain all the data that FBI database returns (files, pictures, descriptions, etc).

-Country codes (alpha2) which are returned from phone validation and GeoIpfy can be converted into string (country names)
