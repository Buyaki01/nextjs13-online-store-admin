import { NextResponse } from "next/server"
import connectMongoDB from "../../../lib/mongoose"
import { Product } from "../../../models/Product"

export async function POST(request) {
  const { productName, description, price, uploadedImagePaths, selectedCategory, properties } = await request.json()

  await connectMongoDB()

  await Product.create({ productName, description, price, uploadedImagePaths, selectedCategory, properties })

  return NextResponse.json({ message: "Product Created" }, { status: 201 })
}

export async function GET() {
  await connectMongoDB()
  const products = await Product.find()

  return NextResponse.json({ products })
}