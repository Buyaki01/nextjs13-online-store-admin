import { writeFile } from 'fs/promises'
import { NextResponse } from 'next/server'
import { join, extname } from 'path'

export async function POST(request) {
  const data = await request.formData()
  const files = data.getAll('uploads')

  if (files.length === 0) {
    return NextResponse.json({ message: "No file to upload" })
  }

  const uploadedImagePaths = []

  for (const file of files) {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const timestamp = Date.now()

    const newFileName = `${timestamp}${file.name}`

    const imagePath = join('public', 'images', newFileName)

    try {
      await writeFile(imagePath, buffer)
      uploadedImagePaths.push(`/images/${newFileName}`)
    } catch (error) {
      console.error('Error saving the uploaded file:', error)
      return NextResponse.json({ message: "Failed to save the uploaded file" })
    }
  }

  return NextResponse.json({ uploadedImagePaths })
}
