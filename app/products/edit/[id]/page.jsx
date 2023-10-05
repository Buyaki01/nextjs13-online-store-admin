'use client'

import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function EditProduct() {

  const [newProductName, setNewProductName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newProductPhotos, setNewProductPhotos] = useState()

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

  const uploadPhotos = async (e) => {
    // console.log(e)
    const files = e.target?.files

    try {
      if (files?.length > 0) {
        const data = new FormData()
  
        for (const file of files) {
          data.append('uploads', file)
        }
  
        const response = await axios.post('/api/uploads', data)
  
        if (!response.ok) throw new Error(await response.text())
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <form onSubmit={updateProduct}>
      <h1>Edit Product</h1>
      <label>Product name</label>
      <input 
        type="text" 
        placeholder="product name" 
        value={newProductName}
        onChange={e => setNewProductName(e.target.value)}
      />

      <label>Photos</label>
      <div className="mb-2">
        {!newProductPhotos?.length && (
          <div>No photos for this product</div>
        )}

        <label className="cursor-pointer w-24 h-24 border mt-2 flex items-center justify-center text-sm gap-1 text-slate-900 rounded-lg bg-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <div>Upload</div>
          <input type="file" onChange={uploadPhotos} multiple className="hidden" />
        </label>

      </div>

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