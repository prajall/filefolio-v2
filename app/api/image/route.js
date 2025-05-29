import { NextResponse } from "next/server";
import { getMultiplePutUrls, listImagesFromFolder } from "../utils/s3"; // Adjust the import path as necessary

export const POST = async (req) => {
  console.log(req);
  const { folder, files } = await req.json(); // files has {name, type} structure

  console.log("Received folder:", folder);
  console.log("Received files:", files);

  if (!folder || !Array.isArray(files)) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }

  try {
    const urls = await getMultiplePutUrls(folder, files);
    return NextResponse.json({ urls }, { status: 200 });
  } catch (err) {
    console.log("Error generating upload URLs:", err);
    return NextResponse.json(
      { error: "Failed to generate upload URLs" },
      { status: 500 }
    );
  }
};

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const folder = searchParams.get("folder");

  if (!folder) {
    return NextResponse.json(
      { error: "Folder parameter is required" },
      { status: 400 }
    );
  }

  try {
    const urls = await listImagesFromFolder(folder);
    return NextResponse.json({ urls }, { status: 200 });
  } catch (err) {
    console.log("Error generating upload URLs:", err);
    return NextResponse.json(
      { error: "Failed to generate upload URLs" },
      { status: 500 }
    );
  }
};
