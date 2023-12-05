import { NextResponse } from "next/server"
import connectMongoDB from "../../../../lib/mongoose"
import Category from "../../../../models/category"
import Product from "../../../../models/product"

export async function DELETE(request, { params }) {
  const { id } = params

  try {
    await connectMongoDB()

    const productsToUpdate = await Product.find({ selectedCategory: id })

    // Update selectedCategory for these products
    for (const product of productsToUpdate) {
      product.selectedCategory = null
      await product.save()
    }

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