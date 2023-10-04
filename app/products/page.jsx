'use client'

import { useSession, signIn, signOut } from "next-auth/react"

import Link from "next/link"
import Nav from "../components/Nav"
import axios from "axios"
import { useEffect, useState } from "react"

export default function Products() {
  
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const { data: session } = useSession()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products')
        setProducts(response.data.products)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }

    fetchProducts()
  
  }, [])

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
        <Link href={'/products/new'} className="new-product py-1 px-2">Add new product</Link>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {products.length > 0 ? (
              products.map((product, index) => (
                <li key={index}>{product.productName}</li>
              ))
            ) : (
              <p>No products available.</p>
            )}
          </ul>
        )}

      </div>
    </div>
  )
}