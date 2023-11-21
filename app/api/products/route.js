import { NextResponse } from "next/server"
import connectMongoDB from '../../../lib/mongoose'
import User from "../../../models/user"
import Product from "../../../models/product"

export async function POST(request) {
  const { userEmail, productName, description, regularPrice, productPrice, uploadedImagePaths, selectedCategory, properties, selectedBrand, stockQuantity, isFeatured } = await request.json()

  await connectMongoDB()

  const user = await User.findOne({ email: userEmail })

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  }

  const userId = user._id

  await Product.create({ user: userId, productName, description, regularPrice, productPrice, uploadedImagePaths, selectedCategory, brand: selectedBrand, quantityInStock: stockQuantity,properties, isFeatured })

  return NextResponse.json({ message: "Product Created" }, { status: 201 })
}

export async function GET(request) {
  await connectMongoDB()

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page')) || 1
  const limit = parseInt(searchParams.get('limit')) || 5
  const skip = (page - 1) * limit
  const products = await Product.find().populate('selectedCategory').limit(limit).skip(skip)
  const totalCount = await Product.countDocuments()

  return NextResponse.json({ products, totalCount })
}