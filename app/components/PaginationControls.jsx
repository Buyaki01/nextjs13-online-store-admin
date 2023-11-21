'use client'

import { useRouter, useSearchParams } from "next/navigation"

const PaginationControls = ({ products, totalCount }) => {
  const router = useRouter()
  const pageParams = useSearchParams()
  const currentPage = parseInt(pageParams.get('page')) || 1
  const limit = parseInt(pageParams.get('limit')) || 5
  const maxPage = Math.ceil(totalCount / limit)

  const handlePrevPage = () => {
    const newPage = Math.max(1, parseInt(currentPage, 10) - 1)
    router.push(`/products?page=${newPage}&limit=${limit}`)
  }

  const handleNextPage = () => {
    const newPage = parseInt(currentPage, 10) + 1
    router.push(`/products?page=${newPage}&limit=${limit}`)
  }

  return (
    <div className="flex gap-2 justify-center">
      <button
        className="bg-slate-500 text-white px-2 py-1 rounded-md"
        onClick={handlePrevPage}
        disabled={currentPage <= 1}
      >
        prev page
      </button>

      <div className="flex items-center">
        <p>{currentPage} / {maxPage} </p>
      </div>

      <button
        className="bg-slate-500 text-white px-2 py-1 rounded-md"
        onClick={handleNextPage}
        disabled={currentPage >= maxPage}
      >
        next page
      </button>
    </div>
  )
}

export default PaginationControls