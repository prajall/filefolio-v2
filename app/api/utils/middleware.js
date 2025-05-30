import bcrypt from "bcrypt";
import folioModel from "../models/folio.model";

export const isFolioAccesible = async (req, folioId) => {
  const password = req.cookies?.password || "";

  const folio = await folioModel.findOne({ folioId });
  if (!folio) {
    return false;
  }

  if (!folio.locked) {
    return true;
  }

  return await bcrypt.compare(password, folio.password);
};
