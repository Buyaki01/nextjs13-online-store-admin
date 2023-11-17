import { NextResponse } from "next/server"
import connectMongoDB from '../../../lib/mongoose'
import Product from '../../../models/product'
import User from "../../../models/user"

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

export async function GET() {
  await connectMongoDB()

  const products = await Product.find().populate('selectedCategory')

  return NextResponse.json({ products })
}