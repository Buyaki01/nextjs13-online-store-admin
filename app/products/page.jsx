'use client'

import Link from "next/link"
import axios from "axios"
import { useEffect, useState } from "react"
import Nav from "../components/Nav"
import SearchInput from "../components/SearchInput"
import { useSearchParams } from "next/navigation"
import PaginationControls from "../components/PaginationControls"

export default function Products() {
  
  const [products, setProducts] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const pageParams = useSearchParams()
 
  const current_page = pageParams.get('page') || 1
  const limit = pageParams.get('limit') || 5

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`/api/products?page=${current_page}&limit=${limit}`)
        setProducts(response.data.products)
        setTotalCount(response.data.totalCount)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }

    fetchProducts()
  
  }, [current_page, limit])

  return (
    <div className="min-h-screen flex">
      <Nav />
      <div className="bg-white flex-grow mt-2 mr-2 mb-2 rounded-lg p-4">
        {loading 
        ? (
            <h1 className="mt-3 text-xl text-center">Loading...</h1>
          ) 
        : (
            products.length > 0 
              ? (
                  <>
                    <div className="flex justify-between">
                      <h1 className="text-lg font-bold">Products</h1>
                      <SearchInput />
                      <Link 
                        href={'/products/new'} 
                        className="btn-default py-1 px-2 text-white flex gap-1 w-52 h-10 items-center whitespace-nowrap"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add new product
                      </Link>
                    </div>
                    <table className="basic my-5">
                      <thead>
                        <tr className="text-center">  
                          <td className="px-4 py-2 whitespace-nowrap">Product Name</td>
                          <td className="px-4 py-2 whitespace-nowrap">Category</td>
                          <td className="px-4 py-2 whitespace-nowrap">Brand</td>
                          <td className="px-4 py-2 whitespace-nowrap">Actions</td>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          products.map((product, index) => (
                            <tr 
                              key={index}
                              className="border-t border-gray-300 text-center"
                            >
                              <td className="px-4 py-2 whitespace-no-wrap">{product.productName}</td>
                              <td className="px-4 py-2 whitespace-no-wrap">{product.selectedCategory.name}</td>
                              <td className="px-4 py-2 whitespace-no-wrap">{product.brand.brandName}</td>
                              <td className="flex gap-2 px-4 py-2 whitespace-no-wrap justify-center">
                                <Link 
                                  className="flex items-center gap-1 px-4 py-1 text-white rounded-md bg-custom-green" 
                                  href={`/products/edit/${product._id}`}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                  </svg>
                                  Edit
                                </Link>
        
                                <Link className="flex items-center gap-1 px-4 py-1 text-white rounded-md bg-red-500" href={`/products/delete/${product._id}`}>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                  </svg>
        
                                  Delete
                                </Link>
        
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                    <PaginationControls products={products} totalCount={totalCount}/>
                  </>
                ) 
              : (
                  <div className="mt-5 text-center">
                    <h1 className="font-semibold">No products available.</h1>
                    <div className="mt-5">
                      <Link href={'/products/new'} className="btn-default py-1 px-2 whitespace-nowrap">Add new product</Link>
                    </div>
                  </div>
                )
          )
        }
      </div>
    </div>
  )
}