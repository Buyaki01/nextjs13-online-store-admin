import { NextResponse } from "next/server"
import connectMongoDB from "../../../lib/mongoose"
import Category from "../../../models/Category"

export async function POST(request) {
  const { name, parentCategory } = await request.json()

  await connectMongoDB()

  await Category.create({ name, parentCategory })

  return NextResponse.json({ message: "Category Created Successfully" }, { status: 201 })
}

export async function GET() {
  await connectMongoDB()
  const categories = await Category.find().populate('parentCategory')

  return NextResponse.json({ categories })
}