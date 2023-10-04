'use client'

import { useParams } from "next/navigation"
import { useEffect } from "react"

export default function EditProduct() {

  const params = useParams()

  const { id } = params

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (id) {
          const response = await axios.put(`/api/products/${id}`)
          console.log(response.data)
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      }
    }

    fetchProduct()
  
  }, [id])

  return (
    <div>Edit</div>
  )
}