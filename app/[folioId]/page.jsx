"use client";
import React, { useEffect, useState } from "react";
import { db } from "../config/config";
import { getDocs, collection, doc, onSnapshot } from "firebase/firestore";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../config/config";
import { motion } from "framer-motion";
import ShareCode from "./components/ShareCode";
import ShareFile from "./components/ShareFile";
import ShareImage from "./components/ShareImage";
import Navbar2 from "../components/Navbar2";
import toast from "react-hot-toast";
import axios from "axios";
import { get } from "mongoose";

const FolioPage = ({ params }) => {
  const [code, setCode] = useState({});
  const [imageList, setImageList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [activeTab, setActiveTab] = useState("code");

  const { folioId } = React.use(params);
  const docRef = doc(db, "folio", folioId);

  const getCode = async () => {
    console.log("Fetching code from client for folioId:", folioId);
    try {
      const response = await axios.get("/api/code", {
        params: { folioId },
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Response:", response);

      setCode(response.data?.code);
    } catch (error) {
      console.error("Error fetching code:", error);
      toast.error("Failed to fetch code.");
    }
  };

  const getImages = async () => {
    // toast.loading("Loading Images...");
    try {
      const response = await axios.get("/api/image", {
        params: { folder: `${folioId}/images` },
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Response of fetch Images:", response);
      setImageList(response.data?.urls || []);
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Failed to fetch images.");
    }
    // toast.dismiss();
  };
  const getFiles = async () => {
    toast.loading("Loading Files...");
    const folderRef = ref(storage, `${folioId}/files`);

    try {
      const response = await listAll(folderRef);
      const filePromises = response.items.map(async (item) => {
        const url = await getDownloadURL(item);
        return { url, name: item.name };
      });
      const files = await Promise.all(filePromises);
      setFileList(files);
    } catch (error) {
      console.error("Error:", error);
    }
    toast.dismiss();
  };

  const downloadFile = async (url) => {
    try {
      const { folder, filename } = await extractS3PathParts(url);

      console.log("Extracted folder:", folder, "filename:", filename);

      if (!folder || !filename) {
        toast.error("Invalid file URL.");
        return;
      }

      // Hit your backend API that streams the file from S3
      const res = await fetch(
        `/api/download?folder=${folder}&filename=${filename}`
      );
      console.log(res);
      if (!res.ok) {
        toast.error("Failed to download file.");
        return;
      }

      const blob = await res.blob(); // Convert stream to Blob

      // Create a temporary <a> element to trigger download
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(downloadUrl); // Clean up
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Something went wrong while downloading.");
    }
  };

  const deleteFile = async (url) => {
    try {
      const { folder, filename } = extractS3PathParts(url);

      if (!folder || !filename) {
        toast.error("Invalid file URL.");
        return;
      }

      const res = await fetch(
        `/api/delete?folder=${folder}&filename=${encodeURIComponent(filename)}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Delete failed.");
        return;
      }

      toast.success("File deleted successfully.");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Something went wrong while deleting.");
    }
  };

  const extractS3PathParts = async (url) => {
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
  };

  useEffect(() => {
    if (!folioId) return;

    getCode();
    getImages();

    const interval = setInterval(() => {
      getCode();
      getImages(); // fetch images every 5 seconds
    }, 5000);

    return () => clearInterval(interval); // cleanup on unmount
  }, [folioId]);

  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setCode(docSnapshot.data());
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <Navbar2 />
      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1, transition: 0.7 }}
        className="w-10/12 mx-auto mb-3"
      >
        <div className="w-fit mx-auto flex gap-2 md:gap-7 lg:gap-10 mb-1 text-xl font-semibold">
          <button
            onClick={() => setActiveTab("code")}
            className={
              activeTab === "code"
                ? "mx-1 p-2 font-bold underline underline-offset-8 duration-300"
                : "mx-1 p-2 duration-300 cursor-pointer"
            }
          >
            Code
          </button>
          <motion.button
            onClick={() => setActiveTab("image")}
            className={
              activeTab === "image"
                ? "mx-1 p-2 font-bold underline underline-offset-8 duration-300"
                : "mx-1 p-2 duration-300 cursor-pointer"
            }
          >
            Images
          </motion.button>
          <button
            onClick={() => setActiveTab("file")}
            className={
              activeTab === "file"
                ? "mx-1 p-2 font-bold underline underline-offset-8 duration-300"
                : "mx-1 p-2 duration-300 cursor-pointer"
            }
          >
            Files
          </button>
        </div>
        {activeTab === "code" && <ShareCode data={code} folioId={folioId} />}
        {activeTab === "image" && (
          <ShareImage
            imageList={imageList}
            onUpload={getImages}
            onDownload={downloadFile}
            // onDelete={deleteFile}
            folioId={folioId}
          />
        )}
        {activeTab === "file" && (
          <ShareFile
            fileList={fileList}
            onUpload={getFiles}
            onDownload={downloadFile}
          />
        )}
      </motion.div>
    </>
  );
};

export default FolioPage;
// dfskjdflskdjflkj
// lsflskdj
