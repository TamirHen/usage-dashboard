// get the current URL without the query params
export function getUrlNoParams(location: Location): string {
   return location.protocol + '//' + location.host + location.pathname
}
