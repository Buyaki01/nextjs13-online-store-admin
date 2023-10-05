import { writeFile } from 'fs/promises'
import { NextResponse } from 'next/server'
import { join } from 'path'

export async function POST(request) {
  const data = await request.formData()

  //'uploads' is from the client side
  //const file = data.get('uploads') - .get will only pick one file, instead of selecting all images
  const files = data.getAll('uploads')

  if (files.length === 0) {
    return NextResponse.json({ message: "No file to upload" })
  }

  for (const file of files) {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const imagePath = join('public', 'images', file.name)

    try {
      await writeFile(imagePath, buffer)
    } catch (error) {
        console.error('Error saving the uploaded file:', error)
        return NextResponse.json({ message: "Failed to save the uploaded file" })
    }
  }

  return NextResponse.json({ message: "All files uploaded successfully" })
}

