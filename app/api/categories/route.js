import { NextResponse } from "next/server"
import connectMongoDB from "../../../lib/mongoose"
import Category from "../../../models/Category"

export async function POST(request) {
  const { name } = await request.json()

  await connectMongoDB()

  await Category.create({ name })

  return NextResponse.json({ message: "Category Created Successfully" }, { status: 201 })
}

export async function GET() {
  await connectMongoDB()
  const categories = await Category.find()

  return NextResponse.json({ categories })
}