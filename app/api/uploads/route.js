import { NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request) {
  const data = await request.formData()
  const files = data.getAll('uploads')

  if (files.length === 0) {
    return NextResponse.json({ message: "No file to upload" })
  }

  const uploadedImageURLs = []

  for (const file of files) {
    const bytes = await file.arrayBuffer()
    const blob = new Blob([Buffer.from(bytes)])

    const imageType = file.type.split('/').pop() // Get the file extension (e.g., 'jpeg', 'png')

    // Customize the filename before uploading (e.g., add a timestamp)
    const timestamp = new Date().getTime()
    const newFilename = `photo${timestamp}.${imageType}`
    console.log(newFilename)

    // Create a FormData object to upload the image to ImgBB with the new filename
    const formData = new FormData()
    formData.append('image', blob, newFilename )

    try {
      const imgbbResponse = await axios('https://api.imgbb.com/1/upload?key=4ceaa761d1a0ae3762060352ac713933', formData)
      console.log(imgbbResponse.data)
      if (imgbbResponse.data.status === 200) {
        uploadedImageURLs.push(imgbbResponse.data.data.url) // URL of the uploaded image on ImgBB
      } else {
        //console.error('Error uploading the file to ImgBB:', imgbbResponse.data.error.message)
        return NextResponse.json({ message: "Failed to upload the file to ImgBB" })
      }
    } catch (error) {
      //console.error('Error uploading the file to ImgBB:', error)
      return NextResponse.json({ message: "Failed to upload the file to ImgBB" })
    }
  }

  return NextResponse.json({ uploadedImageURLs })
}
