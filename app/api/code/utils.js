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
