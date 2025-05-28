import mongoose from "mongoose";

const codeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
    },
    folioId: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Code || mongoose.model("Code", codeSchema);
