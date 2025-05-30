import Folio from "../models/folio.model";
import Code from "../models/code.model";
import { connectDB } from "../utils/db";
import { createCode } from "../utils/utils";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const folioId = searchParams.get("folioId");
    console.log("Received folioId:", folioId);

    if (!folioId) {
      return new Response(JSON.stringify({ error: "folioId is required" }), {
        status: 400,
      });
    }

    const code = await Code.findOne({ folioId }).select("code -_id");
    if (!code) {
      return Response.json({ code: "" }, { status: 200 });
    }
    return Response.json(code, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export const POST = async (request) => {
  try {
    await connectDB();
    const { folioId, code } = await request.json();

    if (!folioId) {
      return new Response(
        JSON.stringify({ error: "folioId and code are required" }),
        {
          status: 400,
        }
      );
    }
    const existingCodeDoc = await Code.findOne({ folioId });
    if (!existingCodeDoc) {
      await createCode(folioId);
    }

    const updatedCode = await Code.findOneAndUpdate(
      { folioId },
      { code },
      { new: true, upsert: true }
    );

    return Response.json({ code: updatedCode.code }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
