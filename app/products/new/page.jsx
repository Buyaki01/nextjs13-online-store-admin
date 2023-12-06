'use client'

import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Spinner from "../../components/Spinner"
import { ReactSortable } from "react-sortablejs"
import { useSession } from "next-auth/react"
import Nav from "../../components/Nav"
import toast from "react-hot-toast"

export default function NewProduct() {

  const [productName, setProductName] = useState('')
  const [description, setDescription] = useState('')
  const [regularPrice, setRegularPrice] = useState('')
  const [productPrice, setProductPrice] = useState('')
  const [uploadedImagePaths, setUploadedImagePaths] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [stockQuantity, setStockQuantity] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [properties, setProperties] = useState({})
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [isLoadingBrands, setIsLoadingBrands] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)
  const [uploadedImagesChanged, setUploadedImagesChanged] = useState(false)

  const router = useRouter()
  const { data: session } = useSession()

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

  async function createProduct(e) {

    e.preventDefault()

    const userEmail = session?.user?.email
    console.log("This is the userEmail client side: ", userEmail)

    const data = { 
      userEmail, 
      productName, 
      description, 
      regularPrice, 
      productPrice, 
      uploadedImagePaths, 
      selectedCategory, 
      properties, 
      selectedBrand,
      stockQuantity, 
      isFeatured 
    } // Sending selectedCategory as an id for Category because our value for option is category._id

    if (!userEmail || 
      !productName || 
      !description || 
      !regularPrice || 
      !productPrice || 
      !uploadedImagePaths || 
      !selectedCategory || 
      !properties ||
      !selectedBrand ||
      !stockQuantity
    ) {
      toast.error('Please fill in all required fields')
      return // Don't proceed with the request if fields are missing
    }

    try {
      const response = await axios.post('/api/products', data)
      console.log("This is the response data for POST product: ", response)
      if(response.status === 201) {
        toast.success('Product created successfully')
      }
      if(response.status === 404) {
        toast.error('User not found. Please login')
      }
      router.push('/products')
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          toast.error('User not found. Please login')
        } else {
          toast.error(`Error: ${error.response.data.message}`)
        }
      } else if (error.request) {
        toast.error('No response received from the server')
      } else {
        toast.error(`Error creating product: ${error.message}`)
      }
      console.error('Error creating product:', error)
    }
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
          const newImagePaths = [...prevImagePaths, ...response.data.uploadedImagePaths]
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
    <div className="min-h-screen flex">
      <Nav />
      <form onSubmit={createProduct} className="bg-white flex-grow mt-2 mr-2 mb-2 rounded-lg p-4">
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
              <select 
                value={properties[p.name]}
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

        <label>Brand</label>
        {isLoadingBrands 
          ? (
              <p className="mb-1">Loading brands...</p>
            )
          : (
              <select
                value={selectedBrand}
                onChange={e => setSelectedBrand(e.target.value)}
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

        <label>Regular Price (in USD)</label>
        <input 
          type="number" 
          placeholder="Regular Price"
          value={regularPrice}
          onChange={e => setRegularPrice(e.target.value)}
        />

        <label>Product Price (in USD)</label>
        <input 
          type="number" 
          placeholder="Product Price"
          value={productPrice}
          onChange={e => setProductPrice(e.target.value)}
        />

        <label>Quantity in Stock</label>
        <input
          type="number"
          placeholder="quantity in stock"
          value={stockQuantity}
          onChange={(e) => setStockQuantity(e.target.value)}
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
    </div>
  )
}