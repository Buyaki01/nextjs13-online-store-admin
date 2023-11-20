import { NextResponse } from "next/server"
import connectMongoDB from '../../../../lib/mongoose'
import Product from "../../../../models/product"

export async function GET(request) {
  await connectMongoDB()

  const products = await Product.find().populate('selectedCategory')

  const { searchParams } = new URL(request.url)
  console.log("This is the searchParams: ", searchParams)
  console.log("This is the request url: ", request.url)

  const query = searchParams.get('query')

  const filteredSearchProducts = products.filter((product) => {
    return product.productName.toLowerCase().includes(query.toLowerCase())
  })

  console.log("This is the filteredSearchProducts: ", filteredSearchProducts)

  return NextResponse.json({ filteredSearchProducts })
}