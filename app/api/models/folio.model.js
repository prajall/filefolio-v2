import mongoose from "mongoose";

const folioSchema = new mongoose.Schema(
  {
    folioId: { type: String, required: true, unique: true, index: true },
    password: { type: String, default: null },
    locked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Folio || mongoose.model("Folio", folioSchema);
