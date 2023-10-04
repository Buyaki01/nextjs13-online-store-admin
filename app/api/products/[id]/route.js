import { NextResponse } from "next/server"
import connectMongoDB from "../../../../lib/mongoose"
import { Product } from "../../../../models/product"

export async function PUT(request, { params }) {

  const { id } = params
  
  console.log("Request Method:", request.method)
  console.log("Request URL:", request.url)
  
  console.log(params) //{ id: '651c28e5376b04cb9464d46c' }
 
  try {
    // Connect to the MongoDB database
    await connectMongoDB()

    // Extract the data from the request body
    const {
      productName,
      description,
      price,
    } = await request.json()

    // Use the Product model to find and update the product by its ID
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { productName, description, price },
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