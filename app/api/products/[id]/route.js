import { NextResponse } from "next/server"
import connectMongoDB from "../../../../lib/mongoose"
import { Product } from "../../../../models/Product"

export async function GET(request, { params }) {
  const { id } = params
  await connectMongoDB()
  const product = await Product.findOne({ _id: id })
  
  return NextResponse.json({ product }, { status: 200 })
}

export async function PUT(request, { params }) {

  const { id } = params
 
  try {
    // Connect to the MongoDB database
    await connectMongoDB()

    // Extract the data from the request body
    const {
      newProductName: productName,
      newDescription: description,
      newPrice: price,
      newUploadedImagePaths: uploadedImagePaths,
    } = await request.json()

    // Use the Product model to find and update the product by its ID
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { productName, description, price, uploadedImagePaths },
      { new: true }
    )

    if (!updatedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Product updated successfully", updatedProduct }, { status: 200 })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ message: "Error updating product" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {

  const { id } = params

  try {
    await connectMongoDB()

    const deletedProduct = await Product.findByIdAndDelete(id)

    if (!deletedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 })

  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ message: "Error deleting product" }, { status: 500 })
  }

}