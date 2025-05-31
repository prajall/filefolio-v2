import folioModel from "../models/folio.model";
import { connectDB } from "./db";
import Code from "../models/code.model";

export const createCode = async (folioId, code = "") => {
  try {
    await connectDB();
    const codeDoc = new Code({ folioId, code });
    await codeDoc.save();
    console.log("Code created:", codeDoc);
    return codeDoc;
  } catch (error) {
    console.error("Error creating code:", error);
    throw error;
  }
};

export const createFolio = async (folioId) => {
  try {
    await connectDB();
    const folioDoc = new folioModel({ folioId });
    await folioDoc.save();
    console.log("Folio created:", folioDoc);
    return folioDoc;
  } catch (error) {
    console.error("Error creating folio:", error);
    throw error;
  }
};
