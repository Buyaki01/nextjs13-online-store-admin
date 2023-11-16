import { NextResponse } from "next/server"
import connectMongoDB from "../../../lib/mongoose"
import Brand from "../../../models/brand"
import User from "../../../models/user"

export async function POST(request) {
  const { userEmail, brandName, parentCategory } = await request.json()

  await connectMongoDB()

  const user = await User.findOne({ email: userEmail })

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  }

  const userId = user._id

  const updatedParentCategory = parentCategory !== undefined && parentCategory !== "" ? parentCategory : null

  await Brand.create({ user: userId, brandName, parentCategory: updatedParentCategory })

  return NextResponse.json({ message: "Brand Added Successfully" }, { status: 201 })
}

export async function GET() {
  await connectMongoDB()
  
  const brands = await Brand.find().populate('parentCategory')

  return NextResponse.json({ brands })
}
