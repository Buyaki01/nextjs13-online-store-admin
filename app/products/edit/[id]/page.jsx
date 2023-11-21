'use client'

import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Spinner from '../../../components/Spinner'
import { ReactSortable } from "react-sortablejs"
import { useSession } from "next-auth/react"
import Nav from "../../../components/Nav"

export default function EditProduct() {
  const { data: session } = useSession()

  const [newProductName, setNewProductName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newRegularPrice, setNewRegularPrice] = useState('')
  const [newProductPrice, setNewProductPrice] = useState('')
  const [brands, setBrands] = useState([])
  const [newStockQuantity, setNewStockQuantity] = useState(null)
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
          setNewProductPrice(productData.productPrice)
          setNewRegularPrice(productData.regularPrice)
          setNewUploadedImagePaths(productData.uploadedImagePaths)
          setNewSelectedCategory(productData.selectedCategory)
          setNewSelectedBrand(productData.brand)
          setNewStockQuantity(productData.quantityInStock)
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

  useEffect(() => {
    const fetchBrands = async () => {
      const response = await axios.get('/api/brands')
      setBrands(response.data.brands)
      setIsLoadingBrands(false)
    }

    fetchBrands()
  }, [])

  const updateProduct = async (e) => {
    e.preventDefault()

    const userEmail = session?.user?.email

    // Create an object with the updated data
    const updatedProduct = {
      userEmail,
      newProductName,
      newDescription,
      newRegularPrice,
      newProductPrice,
      newUploadedImagePaths,
      newSelectedCategory,
      newSelectedBrand,
      newStockQuantity,
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
          const newImagePaths = [...prevImagePaths, ...response.data.uploadedImagePaths]
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
    <div className="min-h-screen flex">
      <Nav />
      <form onSubmit={updateProduct} className="bg-white flex-grow mt-2 mr-2 mb-2 rounded-lg p-4">
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
              ))
            }

            <label>Brand</label>
            {isLoadingBrands 
              ? (
                  <p className="mb-1">Loading brands...</p>
                )
              : (
                  <select
                    value={newSelectedBrand}
                    onChange={e => setNewSelectedBrand(e.target.value)}
                  >
                    <option>No brand yet</option>
                    {brands.length > 0 && brands.map(brand => (
                      <option key={brand._id} value={brand._id}>{brand.brandName}</option>
                    ))}
                  </select>
                ) 
            }

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

              <label>Regular Price (in USD)</label>
              <input 
                type="number" 
                placeholder="Regular Price"
                value={newRegularPrice}
                onChange={e => setNewRegularPrice(e.target.value)}
              />

              <label>Product Price (in USD)</label>
              <input 
                type="number" 
                placeholder="Product Price"
                value={newProductPrice}
                onChange={e => setNewProductPrice(e.target.value)}
              />

              <label>Quantity in Stock</label>
              <input
                type="number"
                placeholder="quantity in stock"
                value={newStockQuantity}
                onChange={(e) => setNewStockQuantity(e.target.value)}
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
    </div>
  )
}