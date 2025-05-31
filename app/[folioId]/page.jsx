"use client";
import axios from "axios";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { extractS3PathParts } from "../../utils/index";
import Navbar2 from "../components/Navbar2";
import ShareCode from "./components/ShareCode";
import ShareFile from "./components/ShareFile";
import ShareImage from "./components/ShareImage";

const FolioPage = ({ params }) => {
  const [code, setCode] = useState({});
  const [imageList, setImageList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [activeTab, setActiveTab] = useState("code");

  const { folioId } = React.use(params);

  const getCode = async () => {
    // console.log("Fetching code from client for folioId:", folioId);
    try {
      const response = await axios.get("/api/code", {
        params: { folioId },
        headers: {
          "Content-Type": "application/json",
        },
      });

      setCode(response.data?.code);
    } catch (error) {
      console.error("Error fetching code:", error);
      toast.error("Failed to fetch code.");
    }
  };

  const getImages = async () => {
    // toast.loading("Loading Images...");
    try {
      const response = await axios.get("/api/file", {
        params: { folder: `${folioId}/images` },
        headers: {
          "Content-Type": "application/json",
        },
      });
      setImageList(response.data?.urls || []);
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Failed to fetch images.");
    }
    // toast.dismiss();
  };
  const getFiles = async () => {
    // toast.loading("Loading Files...");
    try {
      const response = await axios.get("/api/file", {
        params: { folder: `${folioId}/files` },
        headers: {
          "Content-Type": "application/json",
        },
      });
      const urls = response.data?.urls || [];
      const fileNames = urls.map((url) => {
        const { filename } = extractS3PathParts(url);
        return { filename: decodeURIComponent(filename), url };
      });
      setFileList(fileNames);
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error("Failed to fetch files.");
    }
    // toast.dismiss();
  };

  const downloadFile = (url) => {
    const { folder, filename } = extractS3PathParts(url);

    if (!folder || !filename) {
      toast.error("Invalid file URL.");
      return;
    }

    // Create a direct URL to the streaming API
    const apiUrl = `/api/download?folder=${encodeURIComponent(
      folder
    )}&filename=${encodeURIComponent(filename)}`;

    // Create and trigger <a> tag to start streaming download
    toast.success("Downloading file...");
    const a = document.createElement("a");
    a.href = apiUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const deleteFile = async (url) => {
    try {
      console.log(url);
      const { folder, filename } = extractS3PathParts(url);

      console.log(folder, filename);

      if (!folder || !filename) {
        toast.error("Invalid file URL.");
        return;
      }

      const res = await axios.delete(
        `/api/delete?folder=${folder}&filename=${filename}`
      );

      console.log("Delete response:", res);
      const data = res.data;

      if (!res.data?.success) {
        toast.error(data.error || "Delete failed.");
        return;
      }

      toast.success(
        `${activeTab === "image" ? "Image" : "File"} deleted successfully.`
      );
      if (activeTab === "image") {
        const newList = imageList.filter((image) => image !== url);
        setImageList(newList); // Update image list without the deleted image
        getImages(); // Refresh image list
      }
      if (activeTab === "file") {
        const newList = fileList.filter((file) => file !== url);
        setFileList(newList);
        getFiles(); // Refresh file list
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Something went wrong while deleting.");
    }
  };

  useEffect(() => {
    if (!folioId) return;

    getCode();
    getImages();
    getFiles();

    const interval = setInterval(() => {
      getCode();
      // getImages();
      // getFiles(); // fetch images every 5 seconds
    }, 5000);

    // return () => clearInterval(interval); // cleanup on unmount
  }, [folioId]);

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
            onDelete={deleteFile}
            folioId={folioId}
          />
        )}
        {activeTab === "file" && (
          <ShareFile
            fileList={fileList}
            onUpload={getFiles}
            onDownload={downloadFile}
            folioId={folioId}
            onDelete={deleteFile}
          />
        )}
      </motion.div>
    </>
  );
};

export default FolioPage;
// dfskjdflskdjflkj
// lsflskdj
