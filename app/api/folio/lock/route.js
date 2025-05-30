import { NextResponse } from "next/server";
import folioModel from "../../models/folio.model";
import bcrypt from "bcrypt";
import { isFolioAccesible } from "../../utils/middleware";

export const PUT = async (req, res) => {
  const { searchParams } = new URL(req.url);
  const folioId = searchParams.get("folioId");
  const { locked, password = "" } = await req.json();

  if (!folioId) {
    return new Response(JSON.stringify({ error: "folioId is required" }), {
      status: 400,
    });
  }
  try {
    console.log("Received locked status:", locked);

    if (typeof locked !== "boolean") {
      return new Response(
        JSON.stringify({ error: "locked status must be a boolean" }),
        { status: 400 }
      );
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);

    const response = await folioModel.findOneAndUpdate(
      { folioId },
      { locked, password: hashedPassword },
      { new: true, runValidators: true }
    );

    console.log("Folio lock status updated:", response);

    return NextResponse.json(
      { message: "Lock status updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating lock status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const POST = async (req, res) => {
  const { searchParams } = new URL(req.url);
  const folioId = searchParams.get("folioId");

  if (!folioId) {
    return new Response(JSON.stringify({ error: "folioId is required" }), {
      status: 400,
    });
  }

  try {
    const { password = "" } = await req.json();

    const folio = await folioModel.findOne({ folioId });
    console.log(folio);

    const isMatch = await bcrypt.compare(password, folio.password);
    console.log("Password match status:", isMatch);
    console.log("Locked from object:", folio.toObject().locked);

    if (folio.toObject().locked && !isMatch) {
      console.log("Incorrect password provided");
      return NextResponse.json(
        { success: false, message: "Incorrect password" },
        { status: 401 }
      );
    }

    // Set password in HttpOnly cookie (for demonstration; avoid storing plain passwords in cookies in production)
    const response = NextResponse.json(
      { success: true, message: "Password is correct" },
      { status: 200 }
    );
    response.cookies.set("folio_password", password, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });
    return response;
  } catch (error) {
    console.error("Error checking password:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
