import { NextResponse } from "next/server"
import connectMongoDB from "../../../lib/mongoose"
import Category from "../../../models/Category"

export async function POST(request) {
  const { name, parentCategory, properties } = await request.json()

  await connectMongoDB()

  const updatedParentCategory = parentCategory !== undefined && parentCategory !== null ? parentCategory : null

  await Category.create({ name, parentCategory: updatedParentCategory, properties })

  return NextResponse.json({ message: "Category Created Successfully" }, { status: 201 })
}

export async function GET() {
  await connectMongoDB()
  const categories = await Category.find().populate('parentCategory')

  return NextResponse.json({ categories })
}

export async function PUT(request) {
 
  try {
    await connectMongoDB()

    const {
      name, parentCategory, _id, properties
    } = await request.json()

    const updatedParentCategory = parentCategory !== undefined && parentCategory !== null ? parentCategory : null

    const updatedCategory = await Category.findByIdAndUpdate(
      _id,
      { name, parentCategory: updatedParentCategory, properties },
      { new: true }
    )

    if (!updatedCategory) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Category updated successfully", updatedCategory }, { status: 200 })
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json({ message: "Error updating category" }, { status: 500 })
  }
}