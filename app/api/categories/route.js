import { NextResponse } from "next/server"
import connectMongoDB from "../../../lib/mongoose"
import Category from "../../../models/category"

export async function POST(request) {
  const { name, properties } = await request.json()

  await connectMongoDB()

  await Category.create({ name, properties })

  return NextResponse.json({ message: "Category Created Successfully" }, { status: 201 })
}

export async function GET() {
  await connectMongoDB()
  
  const categories = await Category.find()

  return NextResponse.json({ categories })
}

export async function PUT(request) {
 
  try {
    await connectMongoDB()

    const {
      name, _id, properties
    } = await request.json()

    const updatedCategory = await Category.findByIdAndUpdate(
      _id,
      { name, properties },
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