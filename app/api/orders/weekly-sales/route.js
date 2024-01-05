import { NextResponse } from "next/server"
import connectMongoDB from "../../../../lib/mongoose"
import moment from "moment"
import Order from "../../../../models/order"

export async function GET() {
  await connectMongoDB()

  const lastSevenDays = moment()
    .day(moment()
    .day() - 7)
    .format("YYYY-MM-DD HH:mm:ss")

  try {
    const income = await Order.aggregate([
      {
        $match: {createdAt: {$gte: new Date(lastSevenDays)}}
      },
      {
        $project: {
          day: { $dayOfWeek: "$createdAt" },
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
          sales: "$totalPrice" //totalPrice is from the Order model, table
        }
      },
      {
        $group:{
          _id: { day: "$day", month: "$month", year: "$year" },
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