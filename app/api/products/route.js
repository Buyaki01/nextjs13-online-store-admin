import { NextResponse } from "next/server"
import connectMongoDB from "../../../lib/mongoose"
import { Product } from "../../../models/Product"
import { isAdminRequest } from "../auth/[...nextauth]/route"

export async function POST(request) {
  const { productName, description, price, uploadedImagePaths, selectedCategory, properties } = await request.json()

  await connectMongoDB()

  await isAdminRequest()

  await Product.create({ productName, description, price, uploadedImagePaths, selectedCategory, properties })

  return NextResponse.json({ message: "Product Created" }, { status: 201 })
}

export async function GET() {
  await connectMongoDB()
  await isAdminRequest()
  const products = await Product.find()

  return NextResponse.json({ products })
}