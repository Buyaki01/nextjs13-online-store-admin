'use client'

import { useSession, signIn, signOut } from "next-auth/react"

import Link from "next/link"
import Nav from "../components/Nav"
import axios from "axios"

export default async function Products() {

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

  await axios.get('/api/products', {
    cache: "no-store",
  })

  return (
    <div className="admin-panel-container min-h-screen flex">
      <Nav />
      <div className="bg-white flex-grow mt-2 mr-2 mb-2 rounded-lg p-4">
        <Link href={'/products/new'} className="new-product py-1 px-2">Add new product</Link>
      </div>
    </div>
  )
}