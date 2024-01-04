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

  return NextResponse.json({ previousMonth })
}