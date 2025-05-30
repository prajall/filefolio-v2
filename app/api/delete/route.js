import { NextResponse } from "next/server";
import { deleteFileFromS3 } from "../utils/s3";

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get("folder");
    const filename = searchParams.get("filename");

    if (!folder || !filename) {
      return NextResponse.json(
        { error: "Missing folder or filename" },
        { status: 400 }
      );
    }
    console.log("Deleting file from folder:", folder, "filename:", filename);

    const response = await deleteFileFromS3(folder, filename);
    console.log("Delete response:", response);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
