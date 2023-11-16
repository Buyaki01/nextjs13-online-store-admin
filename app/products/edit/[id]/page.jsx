'use client'

import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Spinner from '../../../components/Spinner'
import { ReactSortable } from "react-sortablejs"

export default function EditProduct() {

  const [newProductName, setNewProductName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newRegularPrice, setNewRegularPrice] = useState('')
  const [newProductPrice, setNewProductPrice] = useState('')
  const [newBrands, setNewBrands] = useState([])
  const [newStockQuantity, setNewStockQuantity] = useState(1)
  const [newUploadedImagePaths, setNewUploadedImagePaths] = useState([])
  const [categories, setCategories] = useState([])
  const [newSelectedCategory, setNewSelectedCategory] = useState('')
  const [newSelectedBrand, setNewSelectedBrand] = useState('')
  const [newProperties, setNewProperties] = useState({})
  const [editIsFeatured, setEditIsFeatured] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [isLoadingBrands, setIsLoadingBrands] = useState(true)
  const [uploadedImagesChanged, setUploadedImagesChanged] = useState(false)

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
          setNewUploadedImagePaths(productData.uploadedImagePaths)
          setNewSelectedCategory(productData.selectedCategory)
          setNewProperties(productData.properties || {})
          setEditIsFeatured(productData.isFeatured)
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      }
    }

    fetchProduct()
  }, [id])

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get('/api/categories')
      setCategories(response.data.categories)
      setIsLoadingCategories(false)
    }

    fetchCategories()
  }, [])

  const updateProduct = async (e) => {
    e.preventDefault()

    // Create an object with the updated data
    const updatedProduct = {
      newProductName,
      newDescription,
      newPrice,
      newUploadedImagePaths,
      newSelectedCategory,
      newProperties,
      editIsFeatured
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
        setIsUploading(true)

        const data = new FormData()
  
        for (const file of files) {
          data.append('uploads', file)
        }
  
        const response = await axios.post('/api/uploads', data)
        
        setNewUploadedImagePaths(prevImagePaths => {
          const newImagePaths = [...prevImagePaths, ...response.data.uploadedImageURLs]
          setUploadedImagesChanged(true)
          return newImagePaths
        })

        setIsUploading(false)
      }
    } catch (e) {
      console.error(e)
    }
  }

  function updateImagePathsOrder(newUploadedImagePaths) {
    //console.log(arguments)
    //console.log(newUploadedImagePaths)
    setNewUploadedImagePaths(newUploadedImagePaths)
  }

  function setProductProp(propName,value) {
    setNewProperties(prev => {
      const newProductProps = {...prev}
      newProductProps[propName] = value
      return newProductProps
    })
  }

  const propertiesToFill = []
  if (categories.length > 0 && newSelectedCategory) {
    let categoryInfo = categories.find(({_id}) => _id === newSelectedCategory)
    propertiesToFill.push(...categoryInfo.properties)

    while(categoryInfo?.parentCategory?._id) {
      const categoryForParent = categories.find(({_id}) => _id === categoryInfo.parentCategory._id)
      propertiesToFill.push(...categoryForParent.properties)
      categoryInfo = categoryForParent
    }
  }

  return (
    <form onSubmit={updateProduct}>
      {isLoading 
        ? ( <h1 className="mt-3 text-xl text-center">Loading...</h1> ) 
        : ( 
          <>
            <h1>Edit Product</h1>

            <label>Product name</label>
            <input 
              type="text" 
              placeholder="product name" 
              value={newProductName}
              onChange={e => setNewProductName(e.target.value)}
            />

            <label>Category</label>

            {isLoadingCategories 
              ? (
                  <p className="mb-1">Loading categories...</p>
                )
              : (
                <select
                  value={newSelectedCategory}
                  onChange={e => setNewSelectedCategory(e.target.value)}
                >
                  <option>Uncategorized</option>

                  {categories.length > 0 && categories.map(category => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                  ))}
                </select>

              ) 
            }

            {propertiesToFill.length > 0 && propertiesToFill.map(p => (
              <div 
                key={p.name} 
                className=""
              >
                <label>{p.name[0].toUpperCase()+p.name.substring(1)}</label>
                <div>
                  <select 
                    value={newProperties[p.name] || ''}
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
                list={newUploadedImagePaths} 
                className="flex flex-wrap gap-1"
                setList={updateImagePathsOrder}>
                {!!newUploadedImagePaths?.length && newUploadedImagePaths.map(imagePath => (
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

            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                className="h-6 w-6"
                checked={editIsFeatured}
                onChange={(e) => setEditIsFeatured(e.target.checked)}
              />
    
              <span className="whitespace-nowrap" style={{ marginTop: "-10px" }}>Featured Product</span>
            </label>

            <button 
              type="submit"
              className="btn-default"
            >
              Save
            </button>
          </>
        )
      }
    </form>
  )
}