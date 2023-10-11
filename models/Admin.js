import { Schema, model, models } from "mongoose"

const AdminSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true }, 
})

export default models.Admin || model("Admin", AdminSchema)