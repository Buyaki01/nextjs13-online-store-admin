'use client'

import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Spinner from "../../components/Spinner"
import { ReactSortable } from "react-sortablejs"

export default function NewProduct() {

  const [productName, setProductName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [uploadedImagePaths, setUploadedImagePaths] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [properties, setProperties] = useState({})
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)
  const [uploadedImagesChanged, setUploadedImagesChanged] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get('/api/categories')
      setCategories(response.data.categories)
      setIsLoadingCategories(false)
    }

    fetchCategories()
  }, [])

  async function createProduct(e) {

    e.preventDefault()

    const data = { productName, description, price, uploadedImagePaths, selectedCategory, properties, isFeatured } // Sending selectedCategory as an id for Category because our value for option is category._id

    await axios.post('/api/products', data)

    router.push("/products")
  }

  const uploadPhotos = async (e) => { //Saves the uploaded images directly to the computer/ AWS S3 Bucket / Cloud storage, whatever you would have stated in the server
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
          const newImagePaths = [...prevImagePaths, ...response.data.uploadedImageURLs]
          setUploadedImagesChanged(true) // Set the flag to indicate image changes
          return newImagePaths
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

  function setProductProp(propName,value) {
    setProperties(prev => {
      const newProductProps = {...prev}
      newProductProps[propName] = value
      return newProductProps
    })
  }

  const propertiesToFill = []
  if (categories.length > 0 && selectedCategory) {
    let categoryInfo = categories.find(({_id}) => _id === selectedCategory)
    propertiesToFill.push(...categoryInfo.properties)

    while(categoryInfo?.parentCategory?._id) {
      const categoryForParent = categories.find(({_id}) => _id === categoryInfo.parentCategory._id)
      propertiesToFill.push(...categoryForParent.properties)
      categoryInfo = categoryForParent
    }
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

      <label>Category</label>
      {isLoadingCategories 
        ? (
            <p className="mb-1">Loading categories...</p>
          )
        : (
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              <option>Uncategorized</option>
              {categories.length > 0 && categories.map(category => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
          ) 
      }

      {propertiesToFill.length > 0 && propertiesToFill.map(p => (
        <div key={p.name} className="">
          <label>{p.name[0].toUpperCase()+p.name.substring(1)}</label>
          <div>
            <select value={properties[p.name]}
                    onChange={ev =>
                      setProductProp(p.name,ev.target.value)
                    }
            >
              {p.values.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>
      ))}

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

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          className="h-6 w-6"
          checked={isFeatured}
          onChange={(e) => setIsFeatured(e.target.checked)}
        />
  
        <span className="whitespace-nowrap" style={{ marginTop: "-10px" }}>Featured Product</span>
      </label>

      <button 
        type="submit"
        className="btn-default mt-3"
      >
        Save
      </button>
    </form>
  )
}