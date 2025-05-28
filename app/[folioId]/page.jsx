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

const FolioPage = ({ params }) => {
  const [code, setCode] = useState({});
  const [imageList, setImageList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [activeTab, setActiveTab] = useState("code");

  const { folioId } = React.use(params);
  const collectionRef = collection(db, "folio");
  const docRef = doc(db, "folio", folioId);
  const passwordCollectionRef = collection(db, "password");

  const getFolio = async () => {
    const data = await getDocs(passwordCollectionRef);
    const filteredData = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    filteredData.forEach((data) => {
      if (data.id === folioId) {
        setCode(data);
      }
    });
  };

  const getImages = async () => {
    toast.loading("Loading Images...");
    const folderRef = ref(storage, `${folioId}/images`);
    try {
      const response = await listAll(folderRef);
      console.log("Response", response);
      const imagePromises = response.items.map(async (item) => {
        const url = await getDownloadURL(item);
        return { url: url, name: item.name };
      });
      const images = await Promise.all(imagePromises);
      setImageList(images);
    } catch (error) {
      console.error("Error:", error);
    }
    toast.dismiss();
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

  const downloadFile = async (isFile, fileName) => {
    try {
      const filePath = `${folioId}/${isFile ? "files" : "images"}/${fileName}`;
      const fileRef = ref(storage, filePath);
      const url = await getDownloadURL(fileRef);

      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

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
    } catch (error) {
      console.error("Error fetching code:", error);
      toast.error("Failed to fetch code.");
    }
  };

  useEffect(() => {
    // getFolio();
    // getImages();
    // getFiles();
    getCode();
  }, []);

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
        {activeTab === "code" && <ShareCode data={code} docRef={docRef} />}
        {activeTab === "image" && (
          <ShareImage
            imageList={imageList}
            onUpload={getImages}
            onDownload={downloadFile}
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
