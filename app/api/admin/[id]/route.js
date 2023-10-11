import { NextResponse } from "next/server"
import connectMongoDB from "../../../../lib/mongoose"
import { Admin } from "../../../../models/Admin"
import { isAdminRequest } from "../../auth/[...nextauth]/route"

export async function PUT(request, { params }) {

  const { id } = params
 
  try {
    await connectMongoDB()

    await isAdminRequest()

    const { newEmail: email } = await request.json()

    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      { email },
      { new: true }
    )

    if (!updatedAdmin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Admin email updated successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error updating admin:", error)
    return NextResponse.json({ message: "Error updating admin" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {

  const { id } = params

  try {
    await connectMongoDB()

    await isAdminRequest()

    const deletedAdmin = await Admin.findByIdAndDelete(id)

    if (!deletedAdmin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Admin deleted successfully" }, { status: 200 })

  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ message: "Error deleting product" }, { status: 500 })
  }

}