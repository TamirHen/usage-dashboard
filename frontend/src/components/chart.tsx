import {
   Bar,
   BarChart,
   CartesianGrid,
   Legend,
   Tooltip,
   XAxis,
   YAxis,
} from 'recharts'
import { PeriodicUsage, Usage } from '../types/usage'
import { useMemo } from 'react'
import moment from 'moment'

const DATE_FORMAT = 'MMM Do'

interface Props {
   data: Usage[]
}

const Chart = ({ data }: Props) => {
   const chartData = useMemo(() => {
      let sortedData = data.sort((a, b) =>
         moment(a.timestamp).diff(moment(b.timestamp)),
      )
      // group by dates (normalised to UTC) and sum up the credits for each date
      return sortedData.reduce((chartData: PeriodicUsage[], usage, index) => {
         const chartDataLength = chartData.length
         // if PeriodicUsage with the same date already exists, add the credits used
         if (
            chartDataLength > 0 &&
            chartData[chartDataLength - 1].timestamp ===
               moment(usage.timestamp).utc().format(DATE_FORMAT)
         ) {
            chartData[chartDataLength - 1].creditsUsed =
               chartData[chartDataLength - 1].creditsUsed + usage.credits_used
         } else {
            // else create a new PeriodicUsage with the new date
            chartData.push({
               timestamp: moment(usage.timestamp).utc().format(DATE_FORMAT),
               creditsUsed: usage.credits_used,
            })
         }
         return chartData
      }, [])
   }, [data])

   return (
      <BarChart width={700} height={400} data={chartData}>
         <CartesianGrid vertical={false} />
         <XAxis dataKey={'timestamp'} />
         <YAxis />
         <Tooltip
            cursor={{ fill: '#FFFFFF' }}
            formatter={(value: number) => value.toFixed(2)}
         />
         <Legend />
         <Bar dataKey={'creditsUsed'} name={'Total Credits'} fill="#FF6E2F" />
      </BarChart>
   )
}

export default Chart
