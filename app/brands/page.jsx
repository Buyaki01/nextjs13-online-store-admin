'use client'

import axios from "axios"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useState, useEffect } from "react"

const page = () => {
  const { data: session } = useSession()

  const [brandName, setBrandName] = useState("")
  const [parentCategory, setParentCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [brands, setBrands] = useState([])
  const [loadingBrands, setLoadingBrands] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories')
      setCategories(response.data.categories)
      setLoadingCategories(false)
    } catch (error) {
      console.error("Error fetching Categories:", error)
    }
  }

  useEffect(() => {
    const fetchBrands = async () => {
      const response = await axios.get('/api/brands')
      console.log("This is the response data for brands: ", response.data)
      setBrands(response.data.brands)

      setLoadingBrands(false)
    }

    fetchBrands()
  }, [])

  const saveBrand = async (e) => {
    e.preventDefault()

    const userEmail = session?.user?.email

    await axios.post('/api/brands', { userEmail, brandName, parentCategory })
  }

  return (
    <>
      {loadingCategories
        ? (
          <h1 className="mt-3 text-center">Loading...</h1>
      ) : (
        <>
          <h1 className="text-xl">Create Brand</h1>

          <form onSubmit={saveBrand}>
            <input 
              type="text" 
              placeholder={'Brand name'}
              value={brandName}
              onChange={e => setBrandName(e.target.value)}
            /> 

            <select 
              value={parentCategory}
              onChange={e => setParentCategory(e.target.value)}
            >
              <option value="0">No parent category</option>

              {categories.length > 0 && categories.map(category => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>

            <button type="submit" className="btn-default">Save Brand</button>
          </form>

          {loadingBrands
            ? (
                <h1 className="ml-3 mt-5 text-center">Loading...</h1>
              ) 
            : (
              <div className="mt-5">
                <h1 className="text-xl font-bold">All Brands</h1>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {brands.length > 0 
                      ? (
                        brands.map(brand => (
                          <tr key={brand.brandId}>
                            <td className="px-6 py-4 whitespace-no-wrap">{brand.brandName}</td>
                            <td className="px-6 py-4 whitespace-no-wrap">{brand.parentCategory.name}</td>
                            <td className="flex gap-2 px-6 py-4 whitespace-no-wrap">
                              <Link href={`/brands/edit/brandId`} className="flex gap-1 items-center rounded-md px-3 py-1 text-lg text-white table-edit-link mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                                Edit
                              </Link>
      
                              <Link href={`/brands/delete/brandId`} className="flex gap-1 items-center rounded-md px-3 py-1 text-lg bg-red-500 hover:bg-red-900 text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                                Delete
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) 
                      : (
                        <tr>
                          <td colSpan="3" className="px-3 py-2 text-center">
                            <p className="text-lg text-gray-600">No brands created yet</p>
                          </td>
                        </tr>
                      )
                    }
                  </tbody>
                </table>
              </div>
            )
          }
        </>
      )}
     </>
   )
 }

export default page