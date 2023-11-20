'use client'

import { useState } from "react"
import axios from "axios"
import SearchProductsPage from "../products/search/page"

const SearchProduct = () => {
  const [query, setQuery] = useState('')
  const [searchedProduct, setSearchedProduct] = useState([])

  const searchProduct = async (e) => {
    e.preventDefault()

    const response = await axios.get(`/api/products/search?query=${query}`)
    console.log("This is the response data for filteredSearchProducts: ", response.data.filteredSearchProducts)
    setSearchedProduct(response.data.filteredSearchProducts)
  }
  return (
    <>
      <form onSubmit={searchProduct}>
        <input
          placeholder="Search product..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          type="submit"
        >
          Search
        </button>
      </form>
      
      <SearchProductsPage searchedProduct={searchedProduct} />
    </>
  )
}

export default SearchProduct