import { useState } from 'react'
import './app.scss'
import { useQuery } from '@tanstack/react-query'
import { Usage } from './types/usage'
import { getCurrentPeriodUsage } from './services/usage'
import Table from './components/table'
import Share from './components/share'
import Chart from './components/chart'

function App() {
   const { data, isLoading } = useQuery<Usage[]>({
      queryKey: ['usage'],
      queryFn: getCurrentPeriodUsage,
   })

   const [shareLink, setShareLink] = useState(window.location.href)

   return (
      <div className="app">
         <div className="main-container">
            <div className="title-wrapper">
               <h1>Usage Dashboard</h1>
               <Share link={shareLink} />
            </div>
            {isLoading ? (
               'Loading...'
            ) : data ? (
               <>
                  <div className="description">
                     Usage data in the current billing period
                  </div>
                  <div className="dashboard-wrapper">
                     <Chart data={data} />
                     <Table data={data} setShareLink={setShareLink} />
                  </div>
               </>
            ) : (
               'Could not load data, please try again.'
            )}
         </div>
      </div>
   )
}

export default App
