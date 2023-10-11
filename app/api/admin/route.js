import { NextResponse } from "next/server"
import connectMongoDB from "../../../lib/mongoose"
import { Admin } from "../../../models/Admin"
import { isAdminRequest } from "../auth/[...nextauth]/route"

export async function POST(request) {
  const { email, firstname, lastname, phoneNumber } = await request.json()

  await connectMongoDB()

  await isAdminRequest()

  await Admin.create({ email })

  return NextResponse.json({ message: "Admin Created Successfully" }, { status: 201 })
}

export async function GET() {
  await connectMongoDB()
  await isAdminRequest()
  const admins = await Admin.find()

  return NextResponse.json({ admins })
}