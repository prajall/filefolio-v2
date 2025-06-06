import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const getObjectUrl = async (key) => {
  const command = new GetObjectCommand({
    Bucket: "filefolio.maharjanprajal",
    Key: key,
  });
  const url = getSignedUrl(s3Client, command);
  return url;
};

export const putObjectUrl = async (url, fileName, contentType) => {
  try {
    const command = new PutObjectCommand({
      Bucket: "filefolio.maharjanprajal",
      Key: `${url}/${fileName}`,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3Client, command);
    return url;
  } catch (error) {
    console.error("Error putting object URL:", error);
    throw error;
  }
};

export const getMultiplePutUrls = async (folder, files) => {
  try {
    const urls = await Promise.all(
      files.map(async (file) => {
        const command = new PutObjectCommand({
          Bucket: "filefolio.maharjanprajal",
          Key: `${folder}/${file.name}`,
          ContentType: file.type,
        });

        const signedUrl = await getSignedUrl(s3Client, command, {
          expiresIn: 60 * 5,
        });
        return {
          fileName: file.name,
          url: signedUrl,
        };
      })
    );

    return urls;
  } catch (error) {
    console.error("Error creating multiple signed URLs:", error);
    throw error;
  }
};

export const listFilesFromFolder = async (folderPrefix) => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: "filefolio.maharjanprajal",
      Prefix: folderPrefix, // e.g., 'prajal/images/'
    });

    const { Contents } = await s3Client.send(command);

    if (!Contents || !Array.isArray(Contents)) return [];

    const fileUrls = Contents.map((item) => {
      // return `https://filefolio.maharjanprajal.s3.ap-south-1.amazonaws.com/${item.Key}`;
      return `https://d14lpvkf6jz94c.cloudfront.net/${item.Key}`;
    });
    console.log("File URLs:", fileUrls);
    return fileUrls ? fileUrls : []; // Ensure we return an array
  } catch (error) {
    console.error("Error listing S3 files:", error);
    throw error;
  }
};

export const streamFileFromS3 = async (spaceId, filename) => {
  const command = new GetObjectCommand({
    Bucket: "filefolio.maharjanprajal",
    Key: `${spaceId}/${filename}`,
  });

  const response = await s3Client.send(command);
  const stream = response.Body;

  return {
    stream,
    contentType: response.ContentType,
    contentLength: response.ContentLength,
  };
};

export async function deleteFileFromS3(folder, filename) {
  const Key = `${folder}/${filename}`;

  try {
    const command = new DeleteObjectCommand({
      Bucket: "filefolio.maharjanprajal",
      Key,
    });

    return await s3Client.send(command);
  } catch (error) {
    throw error;
  }
}
