import { NextResponse } from "next/server"
import connectMongoDB from '../../../../lib/mongoose'
import Product from "../../../../models/product"

export async function GET(request) {
  await connectMongoDB()

  const products = await Product.find().populate('selectedCategory').populate('brand')
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')
  const filteredSearchProducts = products.filter((product) => {
    return product.productName.toLowerCase().includes(query.toLowerCase())
  })

  return NextResponse.json({ filteredSearchProducts })
}