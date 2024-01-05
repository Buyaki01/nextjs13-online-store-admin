import { NextResponse } from "next/server"
import connectMongoDB from "../../../../lib/mongoose"
import moment from "moment"
import Order from "../../../../models/order"

export async function GET() {
  await connectMongoDB()

  const previousMonth = moment()
    .month(moment()
    .month() - 1)
    .set("date", 1)//Starts to count from Day 1 of that month
    .format("YYYY-MM-DD HH:mm:ss")

  try {
    const income = await Order.aggregate([
      {
        $match: {createdAt: {$gte: new Date(previousMonth)}}
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
          sales: "$totalPrice" //totalPrice is from the Order model, table
        }
      },
      {
        $group:{
          _id: { month: "$month", year: "$year" },
          total: { $sum: "$sales" }
        }
      },
      {
        $sort: {
          "_id.year": -1,
          "_id.month": -1
        }
      },
    ])

    return NextResponse.json({ income })
  } catch (error) {
    console.error('Error :', error)
    return NextResponse.json({ error: "Failed to get income" })
  }
}