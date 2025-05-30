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
    Bucket: "filefolio-prajalmaharjan",
    Key: key,
  });
  const url = getSignedUrl(s3Client, command);
  return url;
};

export const putObjectUrl = async (url, fileName, contentType) => {
  try {
    const command = new PutObjectCommand({
      Bucket: "filefolio-prajalmaharjan",
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
          Bucket: "filefolio-prajalmaharjan",
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

export const listImagesFromFolder = async (folderPrefix) => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: "filefolio-prajalmaharjan",
      Prefix: folderPrefix, // e.g., 'prajal/images/'
    });

    const { Contents } = await s3Client.send(command);

    if (!Contents) return [];

    const imageUrls = Contents.map((item) => {
      return `https://filefolio-prajalmaharjan.s3.ap-south-1.amazonaws.com/${item.Key}`;
    });
    const filteredUrls = imageUrls.slice(1);
    return filteredUrls ? filteredUrls : []; // Ensure we return an array
  } catch (error) {
    console.error("Error listing S3 images:", error);
    throw error;
  }
};

export const streamFileFromS3 = async (spaceId, filename) => {
  const command = new GetObjectCommand({
    Bucket: "filefolio-prajalmaharjan",
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
      Bucket: "filefolio-prajalmaharjan",
      Key,
    });

    return await s3Client.send(command);
  } catch (error) {
    throw error;
  }
}
