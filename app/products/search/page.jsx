'use client'

import axios from "axios"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Nav from "../../components/Nav"
import SearchInput from "../../components/SearchInput"

const SearchProductsPage = () => {
  
  const searchParams = useSearchParams()
 
  const searchQuery = searchParams.get('query')

  const [searchedProduct, setSearchedProduct] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFilteredSearchResults = async () => {
      const response = await axios.get(`/api/products/search?query=${searchQuery}`)
      setSearchedProduct(response.data.filteredSearchProducts)
      setLoading(false)
    }
    
    fetchFilteredSearchResults()
  }, [searchQuery])

  return (
    <div className="min-h-screen flex">
      <Nav />
      <div className="bg-white flex-grow mt-2 mr-2 mb-2 rounded-lg p-4">
        <SearchInput />
        <div className="mt-5">
          {loading 
            ? ( <p className="text-center text-xl">Loading...</p> ) 
            : searchedProduct.length === 0 
              ? (
                  <p className="text-center text-xl">No products found.</p>) 
              : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {searchedProduct && searchedProduct.map(product => (
                    <Link key={product._id} href={`/products/edit/${product._id}`}>
                      <div>
                        <img 
                          src={product.uploadedImagePaths[0]} 
                          alt={product.productName}
                          className="w-full h-40 object-cover"
                        />
                      </div>

                      <div className="p-3 text-center">
                        <p className="text-base font-semibold mb-1">{product.productName}</p>
                        <h4 className="text-sm text-custom-pink">Ksh. {product.productPrice}</h4>
                      </div>
                    </Link>
                  ))}
                </div>
              )
          }
        </div>
      </div>
    </div>
  )
}

export default SearchProductsPage