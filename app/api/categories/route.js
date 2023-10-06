import { NextResponse } from "next/server"
import connectMongoDB from "../../../lib/mongoose"
import { Category } from "../../../models/category"

export async function POST(request) {
  const { name } = await request.json()

  await connectMongoDB()

  await Category.create({ name })

  return NextResponse.json({ message: "Category Created Successfully" }, { status: 201 })
}