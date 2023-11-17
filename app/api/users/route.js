import { NextResponse } from "next/server"
import connectMongoDB from "../../../lib/mongoose"
import User from "../../../models/user"

export async function GET() {
  await connectMongoDB()

  const users = await User.find()

  return NextResponse.json({ users })
}