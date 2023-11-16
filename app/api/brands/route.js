import { NextResponse } from "next/server"
import connectMongoDB from "../../../lib/mongoose"
import Brand from "../../../models/brand"

export async function GET() {
  await connectMongoDB()
  
  console.log("Inside Brand GET method")
  
  const brands = await Brand.find().populate('parentCategory')
  console.log(brands)

  return NextResponse.json({ brands })
}