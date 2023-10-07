import { NextResponse } from "next/server"
import connectMongoDB from "../../../../lib/mongoose"
import Category from "../../../../models/Category"

export async function DELETE(request, { params }) {
  const { id } = params

  try {
    await connectMongoDB()

    const deletedCategory = await Category.findByIdAndDelete(id)

    if (!deletedCategory) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 })

  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ message: "Error deleting category" }, { status: 500 })
  }
}