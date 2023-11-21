'use client'

import { useRouter, useSearchParams } from "next/navigation"

const PaginationControls = () => {
  const router = useRouter()
  const pageParams = useSearchParams()

  const page = pageParams.get('page') ?? '1'
  const per_page = pageParams.get('per_page') ?? '5'

  return (
    <div className="text-center">
      <button
        className="bg-custom-pink text-white p-1"
        //disabled={!hasPrevPage}
        onClick={() => {
          //router.push(`/?page=${Number(page) - 1}&per_page=${per_page}`)
          router.push(`/products/page?page=${Number(page) -1}&per_page=${per_page}`)
        }}
      >
        prev page
      </button>

      <div>
        {page} / {Math.ceil( 10 / Number(per_page))}
      </div>

      <button
        className="bg-custom-pink text-white p-1"
        //disabled={!hasPrevPage}
        onClick={() => {
          //router.push(`/?page=${Number(page) - 1}&per_page=${per_page}`)
          router.push(`/products/page?page=${Number(page) -1}&per_page=${per_page}`)
        }}
      >
        next page
      </button>
    </div>
  )
}

export default PaginationControls