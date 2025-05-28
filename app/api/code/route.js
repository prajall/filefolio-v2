import Folio from "../models/folio.model";
import { connectDB } from "../utils/db";

const createFolio = async (folioId) => {
  try {
    await connectDB();
    const folio = new Folio({ folioId });
    await folio.save();
    console.log("Folio created:", folio);
    return folio;
  } catch (error) {
    console.error("Error creating folio:", error);
    throw error;
  }
};

export const GET = async (request) => {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const folioId = searchParams.get("folioId");

    if (!folioId) {
      return new Response(JSON.stringify({ error: "folioId is required" }), {
        status: 400,
      });
    }
    console.log("Fetching code for folioId:", folioId);
    console.log("Folio model:", Folio);

    const code = await Folio.findOne({ folioId });
    if (!code) {
      await createFolio(folioId);
      return new Response(JSON.stringify({ code: "" }), {
        status: 201,
      });
    }
    return new Response(JSON.stringify({ code }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};

export const POST = async (request) => {
  try {
    await connectDB();
    const { folioId, code } = await request.json();

    if (!folioId || !code) {
      return new Response(
        JSON.stringify({ error: "folioId and code are required" }),
        {
          status: 400,
        }
      );
    }

    const existingFolio = await Folio.findOne({ folioId });
    if (!existingFolio) {
      await createFolio(folioId);
    }

    const updatedFolio = await Folio.findOneAndUpdate(
      { folioId },
      { code },
      { new: true, upsert: true }
    );

    return new Response(JSON.stringify({ code: updatedFolio.code }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};
