import { NextResponse } from "next/server"
import connectMongoDB from '../../../lib/mongoose'
import Order from "../../../models/order"

export async function GET() {
  await connectMongoDB()

  const orders = await Order.find()

  return NextResponse.json({ orders })
}