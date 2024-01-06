import { NextResponse } from "next/server"
import connectMongoDB from "../../../../lib/mongoose"
import moment from "moment"
import Order from "../../../../models/order"

export async function GET() {
  await connectMongoDB()
  
  const today = moment().startOf("day").format("YYYY-MM-DD HH:mm:ss")

  try {
    const dailyIncome = await Order.aggregate([
      {
        $match: { createdAt: { $gte: new Date(today) } }
      },
      {
        $project: {
          day: { $dayOfMonth: "$createdAt" },
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
          sales: "$totalPrice"
        }
      },
      {
        $group: {
          _id: { day: "$day", month: "$month", year: "$year" },
          total: { $sum: "$sales" }
        }
      },
      {
        $sort: {
          "_id.year": -1,
          "_id.month": -1,
          "_id.day": -1
        }
      },
    ])

    return NextResponse.json({ dailyIncome })
  } catch (error) {
    console.error('Error :', error)
    return NextResponse.json({ error: "Failed to get daily income" })
  }
}
