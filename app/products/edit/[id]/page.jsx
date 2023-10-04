'use client'

import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function EditProduct() {

  const [newProductName, setNewProductName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newPrice, setNewPrice] = useState('')

  const [product, setProduct] = useState(null)

  const params = useParams()

  const { id } = params

  const router = useRouter()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (id) {
          const response = await axios.get(`/api/products/${id}`)
          const productData = response.data.product
          setProduct(productData)
          setNewProductName(productData.productName)
          setNewDescription(productData.description)
          setNewPrice(productData.price)
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      }
    }

    fetchProduct()
  
  }, [id])

  const updateProduct = async (e) => {
    e.preventDefault()

    // Create an object with the updated data
    const updatedProduct = {
      newProductName,
      newDescription,
      newPrice,
    }

    try {
      // Send the updated data to the server to update the product
      await axios.put(`/api/products/${id}`, updatedProduct)

      // Redirect to the product list page after successful update
      router.push("/products")
    } catch (error) {
      console.error("Error updating product:", error)
    }
  }

  return (
    <form onSubmit={updateProduct}>
      <h1>New Product</h1>
      <label>Product name</label>
      <input 
        type="text" 
        placeholder="product name" 
        value={newProductName}
        onChange={e => setNewProductName(e.target.value)}
      />

      <label>Description</label>
      <textarea 
        placeholder="description"
        value={newDescription}
        onChange={e => setNewDescription(e.target.value)}
      />

      <label>Price (in USD)</label>
      <input 
        type="number" 
        placeholder="price"
        value={newPrice}
        onChange={e => setNewPrice(e.target.value)}
      />

      <button 
        type="submit"
        className="btn-primary"
      >
        Save
      </button>
    </form>
  )
}