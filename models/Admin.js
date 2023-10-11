import { Schema, model, models } from "mongoose"

const AdminSchema = new Schema({
  email: { type: String, required: true, unique: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  phoneNumber: { type: String, required: true }, 
  //role: { type: String },
})

export default models.Admin || model("Admin", AdminSchema)