import mongoose, { Schema, model, models } from 'mongoose'

const BrandSchema = new Schema({
  user: {
    type:mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  brandName: { type: String, required: true },
  parentCategory: { type:mongoose.Schema.Types.ObjectId, ref:'Category', default: null },
}, {
  timestamps: true,
}
)

const Brand = models?.Brand || model('Brand', BrandSchema)

export default Brand