'use client'

import { useSession, signIn, signOut } from "next-auth/react"
import Nav from "./components/Nav"

export default function Home() {
  const { data: session } = useSession()

  if (!session) {
    return (
      <div className="flex items-center w-screen h-screen">
        <div className="text-center w-full">
          <button onClick={() => signIn('google')} className=" text-white bg-slate-700 p-2 rounded-lg">Login with Google</button>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-panel-container min-h-screen flex">
      <Nav />
      <div className="bg-white flex-grow mt-2 mr-2 mb-2 rounded-lg p-4">

        <div className="text-lime-900 flex justify-between">
          <h2> Hello, <b>{session?.user?.name}</b> </h2>

          <div className="flex bg-slate-300 gap-1 rounded-lg overflow-hidden">
            <img src={session?.user?.image} alt="" className="w-6 h-6" />
            <span className="px-2">
              {session?.user?.name}
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}
