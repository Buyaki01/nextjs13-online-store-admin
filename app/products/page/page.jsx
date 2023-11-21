'use client'

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Nav from "../../components/Nav"

const ProductsPageNavigation = () => {
  const searchParams = useSearchParams()
 
  const pageQuery = searchParams['page'] ??  '1'
  console.log("This is the page query: ", pageQuery)

  const per_page = searchParams['per_page'] ?? '5'

  const start = (Number(page) - 1) * Number(per_page)
  const end = start + Number(per_page)

  return (
    <div>ProductsPageNavigation</div>
  )
}

export default ProductsPageNavigation