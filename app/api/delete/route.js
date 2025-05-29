import { NextResponse } from "next/server";
import { deleteFileFromS3 } from "../utils/s3";

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const spaceId = searchParams.get("spaceId");
    const filename = searchParams.get("filename");

    if (!spaceId || !filename) {
      return NextResponse.json(
        { error: "Missing spaceId or filename" },
        { status: 400 }
      );
    }

    await deleteFileFromS3(spaceId, filename);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
