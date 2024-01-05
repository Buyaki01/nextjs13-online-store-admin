import { NextResponse } from "next/server"
import connectMongoDB from "../../../../lib/mongoose"
import User from "../../../../models/user"
import moment from "moment"

export async function GET() {
  await connectMongoDB()

  const previousMonth = moment()
    .month(moment()
    .month() - 1)
    .set("date", 1)
    .format("YYYY-MM-DD HH:mm:ss")

  try {
    const users = await User.aggregate([
      {
        $match: {createdAt: {$gte: new Date(previousMonth)}}
      },
      {
        $project: {
          month: {$month: "$createdAt"}
        }
      },
      {
        $group:{ //froup will return an array with _id and total
          _id: "$month", //The id will be in terms of the month
          total: {$sum: 1}
        }
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ])

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error :', error)
    return NextResponse.json({ error: "Failed to save the uploaded file" })
  }
}