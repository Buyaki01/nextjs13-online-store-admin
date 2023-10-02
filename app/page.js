'use client'

import { useSession, signIn, signOut } from "next-auth/react"

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
    <div>Logged In {session.user.email}</div>
  )
}
