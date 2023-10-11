import { Schema, model, models } from "mongoose"

const AdminSchema = new Schema({
  email: { type: String, required: true, unique: true },
})

export default models.Admin || model("Admin", AdminSchema)