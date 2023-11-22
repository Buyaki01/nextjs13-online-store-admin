'use client'

import { useSession } from "next-auth/react"

const Dashboard = () => {

  const { data: session } = useSession()

  return (
    <div className="text-lime-900 flex justify-between">
      <h2> Hello, 
        <b>{session?.user?.name}</b> 
      </h2>

      <div className="flex bg-slate-300 gap-1 rounded-lg overflow-hidden">
        <img src={session?.user?.image} alt="" className="w-6 h-6" />
        <span className="px-2">
          {session?.user?.name}
        </span>
      </div>
    </div>  
  )
}

export default Dashboard