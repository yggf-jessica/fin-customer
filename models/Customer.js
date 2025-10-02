import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  dateOfBirth: { type: Date, required: true },
  memberNumber: { type: Number, required: true, unique: true, min: 1 },
  interests: { type: String, trim: true },
}, { timestamps: true });

export default mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);