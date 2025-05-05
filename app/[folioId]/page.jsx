import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../config/config";
import { getDocs, collection, doc, onSnapshot } from "firebase/firestore";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../config/config";
import { motion } from "framer-motion";
import ShareCode from "./components/ShareCode";
import ShareFile from "./components/ShareFile";
import ShareImage from "./components/ShareImage";
import Navbar2 from "../components/Navbar2";
import Navbar1 from "../components/Navbar1";
import { BiSolidLockAlt } from "react-icons/bi";
import Alert from "../components/Alert";

const SharePage = () => {
  const [code, setCode] = useState({});
  const [imageList, setImageList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [activeTab, setActiveTab] = useState("image");
  const [password, setPassword] = useState("");
  const [isPrivate, setIsPrivate] = useState(null);
  const [unlock, setUnlock] = useState(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [alertStatus, setAlertStatus] = useState("hide");
  // const [databaseExist, setDatabaseExist] = useState(false);

  const params = useParams().id;
  const collectionRef = collection(db, "folio");
  const docRef = doc(db, "folio", params);
  const passwordCollectionRef = collection(db, "password");
  const passwordDocRef = doc(db, "password", params);

  const getFolio = async () => {
    const data = await getDocs(passwordCollectionRef);
    const filteredData = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    filteredData.forEach((data) => {
      if (data.id === params) {
        setCode(data);
      }
    });
  };

  const getImages = async () => {
    const folderRef = ref(storage, `${params}/images`);

    try {
      const response = await listAll(folderRef);
      const imagePromises = response.items.map(async (item) => {
        const url = await getDownloadURL(item);
        return { url: url, name: item.name };
      });
      const images = await Promise.all(imagePromises);
      setImageList(images);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getFiles = async () => {
    const folderRef = ref(storage, `${params}/files`);

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
  };

  const checkPrivacy = async () => {
    const data = await getDocs(passwordCollectionRef);
    let databaseExist = false;
    const filteredData = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    filteredData.forEach((data) => {
      if (data.id === params) {
        databaseExist = true;
        setPassword(data.password);
        setIsPrivate(data.private);
        if (data.private) {
          setUnlock(false);
        } else setUnlock(true);
      }
      if (!databaseExist) {
        setUnlock(true);
      }
    });
  };

  const handlePasswordSubmit = () => {
    event.preventDefault();
    console.log(passwordInput);
    console.log(password);
    if (passwordInput === password) {
      setUnlock(true);
    } else {
      setAlertStatus("show");
      setTimeout(() => {
        setAlertStatus("hide");
      }, 3000);
      setPasswordInput("");
    }
  };

  const downloadFile = async (isFile, fileName) => {
    try {
      const filePath = `${params}/${isFile ? "files" : "images"}/${fileName}`;
      console.log("FilePath:", filePath, fileName);
      const fileRef = ref(storage, filePath);
      const url = await getDownloadURL(fileRef);

      const response = await fetch(url);
      const blob = await response.blob();

      const blobUrl = URL.createObjectURL(blob);

      // Create a temporary anchor tag to trigger the download
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

  useEffect(() => {
    checkPrivacy();
  }, []);

  useEffect(() => {
    if (unlock) {
      getFolio();
      getImages();
      getFiles();
    }
  }, [unlock]);

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
      {alertStatus === "show" && (
        <Alert message={"incorrect password"} type={"fail"} />
      )}
      {unlock === true && (
        <>
          <Navbar2 />
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1, transition: 0.7 }}
            className="w-10/12 mx-auto mb-3"
          >
            <div className="w-fit mx-auto flex gap-2 md:gap-7 lg:gap-10 mb-1 text-xl font-semibold">
              <button
                onClick={() => {
                  setActiveTab("code");
                }}
                className={
                  activeTab === "code"
                    ? "mx-1 p-2 font-bold underline underline-offset-8 duration-300"
                    : "mx-1 p-2 duration-300 "
                }
              >
                Code
              </button>
              <motion.button
                onClick={() => {
                  setActiveTab("image");
                }}
                className={
                  activeTab === "image"
                    ? "mx-1 p-2 font-bold underline underline-offset-8 duration-300"
                    : "mx-1 p-2 duration-300"
                }
              >
                Images
              </motion.button>
              <button
                onClick={() => {
                  setActiveTab("file");
                }}
                className={
                  activeTab === "file"
                    ? "mx-1 p-2 font-bold underline underline-offset-8 duration-300"
                    : "mx-1 p-2 duration-300"
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
      )}
      {unlock === false && (
        <div>
          <Navbar1 />
          <div className="w-full h-screen fixed top-0 flex justify-center items-center">
            <div className="password-container w-[300px] md:w-[400px] lg:w-[500px] border-2 rounded-xl px-2 py-5 justify-center text-center ">
              <h3 className="text-2xl mb-2 font-bold flex items-center justify-center ">
                <BiSolidLockAlt />
                Locked Folio
              </h3>
              <p>
                This Folio is locked. Please enter password to unlock the files
              </p>
              <form className="flex flex-col mx-auto w-52 md:w-60">
                <input
                  type="password"
                  className="border p-2 mt-3 text-sm rounded-lg w-full "
                  placeholder="Password"
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                  }}
                  value={passwordInput}
                />
                <button
                  type="submit"
                  className="py-1 px-2 bg-slate-900 text-primary w-full rounded-lg mt-3"
                  onClick={handlePasswordSubmit}
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SharePage;
