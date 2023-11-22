'use client'

import { useSession, signIn } from "next-auth/react"
import { FaGoogle } from "react-icons/fa"
import Nav from "./components/Nav"
import Dashboard from "./components/Dashboard"

export default function Home() {
  const { data: session } = useSession()

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-fit h-full">
        <div className="
          max-w-[600px]
          w-full
          flex
          flex-col
          gap-6
          items-center
          shadow-xl
          shadow-slate-200
          rounded-md
          my-8
          p-4
          md:p-8
        ">
          <h2 className="text-3xl font-bold mb-4">Welcome to Pearls Collections</h2>
          <button 
            onClick={() => signIn('google')} 
            className="flex items-center gap-2 bg-custom-pink text-white px-4 py-2 rounded-md hover:bg-custom-pink-hover focus:outline-none focus:ring focus:border-custom-pink"
          >
            <FaGoogle size={24} />
            Login with Google
          </button>
        </div>
      </div>
    )
  }

  if (session.user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-fit h-full">
        <p>You do not have permission to access this page.</p>
      </div>
    )
  }

  return (
    <div className="admin-panel-container min-h-screen flex">
      <Nav />
      <div className="bg-white flex-grow mt-2 mr-2 mb-2 rounded-lg p-4">
        <Dashboard />
      </div>
    </div>
  )
}
