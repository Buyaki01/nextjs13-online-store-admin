'use client'

import { useSession } from "next-auth/react"
import { UsersStats } from "./MonthlyUsersStats"
import { OrdersStats } from "./MonthlyOrdersStats"
import { EarningsStats } from "./MonthlyEarningsStats"
import { TodaysPerformance } from "./daily-reports/TodaysPerformance"
import { WeekSalesChart } from "./WeeklyEarningsChart"

const Dashboard = () => {

  const { data: session } = useSession()

  return (
    <div>
      <div className="text-lime-900 flex justify-between mb-8">
        <h2> Hello, 
          <b className="ml-1">{session?.user?.name}</b> 
        </h2>

        <div className="flex bg-slate-300 gap-1 rounded-lg overflow-hidden">
          <img src={session?.user?.image} alt="" className="w-6 h-6" />
          <span className="px-2">
            {session?.user?.name}
          </span>
        </div>
      </div>
      <div>
        <h1 className="font-bold">Monthly Performance Comparison</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
          <UsersStats />
          <OrdersStats />
          <EarningsStats />
        </div>
      </div>
      <div className="mt-10 mb-5">
        <TodaysPerformance />
      </div>
      <div className="mt-10">
        <WeekSalesChart />
      </div>
    </div>  
  )
}

export default Dashboard