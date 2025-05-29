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

    const decodedFilename = decodeURIComponent(filename);
    const { stream, contentType, contentLength } = await streamFileFromS3(
      folder,
      decodedFilename
    );

    return new Response(stream, {
      headers: {
        "Content-Type": contentType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${decodedFilename}"`,
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
