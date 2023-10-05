'use client'

import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function DeleteProduct() {
  const router = useRouter()

  const [product, setProduct] = useState()
  const [loading, setLoading] = useState(true)

  const params = useParams()

  const { id } = params

  useEffect(() => {

    const fetchProduct = async () => {
      try {
        if (id) {
          const response = await axios.get(`/api/products/${id}`)
          setProduct(response.data.product)
          setLoading(false)
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      }
    }

    fetchProduct()

  }, [id])

  const handleButtonClick = () => {
    router.push('/products')
  }

  async function deleteProduct() {
    if(id) {
      await axios.delete(`/api/products/${id}`)
      router.push('/products')
    }
  }

  return (
    <>
      {loading 
        ? (
            <h1 className="mt-3 text-xl text-center">Loading...</h1>
          ) 
        : (
          <>
            <h1 className="text-center">Do you really want to delete&nbsp;<span className="delete-product bold underline">{product?.productName}</span>?</h1>
            <div className="flex gap-2 justify-center">
              <button className="btn-red" onClick={deleteProduct}>Yes</button>
              <button className="btn-default" onClick={handleButtonClick}>No</button>
            </div>
          </>
        )
      }
    </>
  )
}