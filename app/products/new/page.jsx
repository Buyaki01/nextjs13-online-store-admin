'use client'

import Nav from "../../components/Nav"
import axios from "axios"
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function NewProduct() {

  const { data: session } = useSession()
  const [productName, setProductName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')

  const router = useRouter()

  if (!session) {
    return (
      <div className="flex items-center w-screen h-screen">
        <div className="text-center w-full">
          <button onClick={() => signIn('google')} className=" text-white bg-slate-700 p-2 rounded-lg">Login with Google</button>
        </div>
      </div>
    )
  }

  async function createProduct(e) {

    e.preventDefault()

    const data = { productName, description, price }

    await axios.post('/api/products', data)

    router.push("/products")
  }

  return (
    <div className="admin-panel-container min-h-screen flex">
      <Nav />
      <div className="bg-white flex-grow mt-2 mr-2 mb-2 rounded-lg p-4">
        <form onSubmit={createProduct}>
          <h1>New Product</h1>
          <label>Product name</label>
          <input 
            type="text" 
            placeholder="product name" 
            value={productName}
            onChange={e => setProductName(e.target.value)}
          />

          <label>Description</label>
          <textarea 
            placeholder="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <label>Price (in USD)</label>
          <input 
            type="number" 
            placeholder="price"
            value={price}
            onChange={e => setPrice(e.target.value)}
          />

          <button 
            type="submit"
            className="btn-primary"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  )
}