const { Schema, model, models } = require("mongoose")

const ProductSchema = new Schema({
  productName: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  uploadedImagePaths: [{ type: String }],
})

export const Product = models.Product || model('Product', ProductSchema)