import { NextResponse } from "next/server"
import connectMongoDB from "../../../lib/mongoose"
import { Product } from "../../../models/Product"

export async function POST(request) {
  const { productName, description, price } = await request.json()

  await connectMongoDB()

  await Product.create({ productName, description, price })

  return NextResponse.json({ message: "Product Created" }, { status: 201 })
}