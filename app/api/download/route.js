import { NextResponse } from "next/server";
import { streamFileFromS3 } from "../utils/s3";

export const GET = async (req) => {
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
    console.log("Downloading file from folder:", folder, "filename:", filename);

    const { stream, contentType, contentLength } = await streamFileFromS3(
      folder,
      filename
    );

    return new Response(stream, {
      headers: {
        "Content-Type": contentType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": contentLength?.toString() || undefined,
      },
    });
  } catch (err) {
    console.error("Download error:", err);
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500 }
    );
  }
};
