'use client'

import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Spinner from "../../components/Spinner"
import { ReactSortable } from "react-sortablejs"

export default function NewProduct() {

  const [productName, setProductName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [uploadedImagePaths, setUploadedImagePaths] = useState([])
  const [isUploading, setIsUploading] = useState(false)

  const router = useRouter()

  async function createProduct(e) {

    e.preventDefault()

    const data = { productName, description, price, uploadedImagePaths }

    await axios.post('/api/products', data)

    router.push("/products")
  }

  const uploadPhotos = async (e) => { //Saves the uploaded images directly to the server
    const files = e.target?.files

    try {
      if (files?.length > 0) {
        setIsUploading(true)

        const data = new FormData()
  
        for (const file of files) {
          data.append('uploads', file)
        }
  
        const response = await axios.post('/api/uploads', data)

        setUploadedImagePaths(prevImagePaths => {
          return [...prevImagePaths, ...response.data.uploadedImagePaths] //The uploadedImagePaths in response.data.uploadedImagePaths is coming from the server
        })
        
        setIsUploading(false)
      }
    } catch (e) {
      console.error(e)
    }
  }

  function updateImagePathsOrder(uploadedImagePaths) {
    setUploadedImagePaths(uploadedImagePaths)
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

      <label>Photos</label>
      <div className="mb-3 flex flex-wrap gap-1">
         
        <ReactSortable 
          list={uploadedImagePaths} 
          className="flex flex-wrap gap-1"
          setList={updateImagePathsOrder}>
          {!!uploadedImagePaths?.length && uploadedImagePaths.map(imagePath => (
            <div key={imagePath} className="h-24">
              <img src={imagePath} alt="" className="rounded-lg" />
            </div>
          ))}
        </ReactSortable>

        {isUploading && (
          <div className="h-24 flex items-center"> 
            <Spinner />
          </div>
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
        className="btn-default"
      >
        Save
      </button>
    </form>
  )
}