import { NextResponse } from "next/server"
import connectMongoDB from "../../../lib/mongoose"
import Brand from "../../../models/brand"
import User from "../../../models/user"
import Category from "../../../models/category"

export async function POST(request) {
  const { userEmail, brandName, parentCategory } = await request.json()

  await connectMongoDB()

  const user = await User.findOne({ email: userEmail })

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  }

  const userId = user._id

  await Brand.create({ user: userId, brandName, parentCategory })

  return NextResponse.json({ message: "Brand Added Successfully" }, { status: 201 })
}

export async function GET() {
  await connectMongoDB()
  await Category.find()
  
  const brands = await Brand.find().populate('parentCategory')

  return NextResponse.json({ brands })
}
