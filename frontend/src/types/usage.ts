export interface Usage {
   message_id: number
   timestamp: string
   // props are in snake_case as this is the format returned from the API
   report_name?: string
   credits_used: number
}

export interface UsageResponse {
   usage: Usage[]
}

export interface PeriodicUsage {
   timestamp: string
   creditsUsed: number
}
