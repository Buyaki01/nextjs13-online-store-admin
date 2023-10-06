import { Schema, model, models } from "mongoose"

const CategorySchema = new Schema({
  name: { type: String, required: true },
})

export default models.Category || model("Category", CategorySchema)
