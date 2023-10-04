'use client'

import Link from "next/link"
import axios from "axios"
import { useEffect, useState } from "react"

export default function Products() {
  
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

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
      
  return (
    <>
      <Link href={'/products/new'} className="new-product py-1 px-2">Add new product</Link>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="basic mt-5">
          <thead>
            <tr>
              <td>Product name</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 
              ? (
                  products.map((product, index) => (
                    <tr key={index}>
                      <td>{product.productName}</td>
                      <td>
                        <Link href={`/products/edit/${product._id}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))
                ) 
              : (
                  <p>No products available.</p>
                )
            }
          </tbody>
        </table>
      )}

    </>
  )
}