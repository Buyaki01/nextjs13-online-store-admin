import { NextResponse } from "next/server"
import connectMongoDB from "../../../../lib/mongoose"
import Product from "../../../../models/Product"
import User from "../../../../models/user"

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
      userEmail,
      newProductName: productName,
      newDescription: description,
      newRegularPrice: regularPrice,
      newProductPrice: productPrice,
      newUploadedImagePaths: uploadedImagePaths,
      newSelectedCategory: selectedCategory,
      newProperties: properties,
      newSelectedBrand: selectedBrand,
      newStockQuantity: stockQuantity,
      editIsFeatured: isFeatured
    } = await request.json()

    const user = await User.findOne({ email: userEmail })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const userId = user._id

    // Use the Product model to find and update the product by its ID
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { user: userId, productName, description, regularPrice, productPrice, uploadedImagePaths, selectedCategory, brand: selectedBrand, quantityInStock: stockQuantity, properties, isFeatured },
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