import { NextResponse } from "next/server";
import { streamFileFromS3 } from "../utils/s3";
import { isFolioAccesible } from "../utils/middleware";

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get("folder");
    const filename = decodeURIComponent(searchParams.get("filename"));

    if (!folder || !filename) {
      return NextResponse.json(
        { error: "Missing folder or filename" },
        { status: 400 }
      );
    }
    console.log("Downloading file from folder:", folder, "filename:", filename);

    const folioId = folder.split("/")[0];
    console.log("Folio ID extracted from folder:", folioId);

    const allowed = await isFolioAccesible(req, folioId);
    if (!allowed) {
      return NextResponse.json(
        { error: "Folio not accessible" },
        { status: 403 }
      );
    }

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
