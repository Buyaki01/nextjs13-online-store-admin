'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

const SearchInput = () => {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const searchProduct = async (e) => {
    e.preventDefault()
    router.push(`/products/search?query=${query}`)
  }

  return (
    <>
      <form onSubmit={searchProduct}>
        <div className="flex items-center gap-1">
          <input
            placeholder="Search product..."
            className="flex-grow outline-none px-2 py-1 mb-0"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            type="submit"
            className="bg-custom-pink text-white px-4 py-1 rounded-md"
          >
            Search
          </button>
        </div>
      </form>
    </>
  )
}

export default SearchInput