'use client'

import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function NewProduct() {

  const [productName, setProductName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')

  const router = useRouter()

  async function createProduct(e) {

    e.preventDefault()

    const data = { productName, description, price }

    await axios.post('/api/products', data)

    router.push("/products")
  }

  return (
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
  )
}