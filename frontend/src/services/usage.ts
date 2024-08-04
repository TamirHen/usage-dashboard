import { Usage, UsageResponse } from '../types/usage'
import axios from 'axios'

export async function getCurrentPeriodUsage(): Promise<Usage[]> {
   const endpointUrl =
      process.env.REACT_APP_BACKEND_BASE_URL + process.env.REACT_APP_USAGE_PATH
   const response = await axios.get<UsageResponse>(endpointUrl)
   if (response.data?.usage) {
      return response.data.usage
   } else {
      throw new Error(`Unexpected type returned from ${endpointUrl}`)
   }
}
