'use client'

import { useSession } from "next-auth/react"
import { UsersStats } from "./UsersStats"
import { OrdersStats } from "./OrdersStats"
import { EarningsStats } from "./EarningsStats"

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <UsersStats />
        <OrdersStats />
        <EarningsStats />
      </div>
    </div>  
  )
}

export default Dashboard