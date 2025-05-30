export function cn(...classes) {
  return classes.filter(Boolean).join(" ").trim();
}

export function extractS3PathParts(url) {
  try {
    const { pathname } = new URL(url); // e.g., "/test/images/20250409_080511.jpg"
    const parts = pathname.slice(1).split("/"); // remove leading slash and split

    const filename = parts.pop(); // last part is the filename
    const folder = parts.join("/"); // remaining parts are the folder path

    return { folder, filename };
  } catch (error) {
    console.error("Invalid S3 URL:", error);
    return { folder: null, filename: null };
  }
}
