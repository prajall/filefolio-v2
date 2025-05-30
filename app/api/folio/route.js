import Folio from "../models/folio.model";
import Code from "../models/code.model";
import { connectDB } from "../utils/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const folioId = searchParams.get("folioId");
  try {
    await connectDB();
    const folio = await Folio.findOne({ folioId }).select(
      "-password -__v -createdAt -updatedAt"
    );

    if (!folio) {
      await createFolio(folioId);
      const newFolio = await Folio.findOne({ folioId }).select(
        "-password -__v -createdAt -updatedAt"
      );
      return NextResponse.json({ folio: newFolio }, { status: 201 });
    }
    return NextResponse.json({ folio }, { status: 200 });
  } catch (error) {
    console.error("Error fetching folio:", error);
    return NextResponse.json(
      { error: "Failed to fetch folio" },
      { status: 500 }
    );
  }
}
