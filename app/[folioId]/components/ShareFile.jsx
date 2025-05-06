"use client";
import React, { useState } from "react";
import { uploadBytes, ref, deleteObject } from "firebase/storage";
import { storage } from "../../config/config";
import { useParams } from "next/navigation";
import { CirclePlus, Trash, File, Download } from "lucide-react";
import { motion } from "framer-motion";
import Container from "../../components/Container";
import Alert from "../components/Alert";

const ShareFile = ({ fileList, onUpload, onDownload, folioId }) => {
  const [files, setFiles] = useState(null);
  const params = useParams().id;
  const [alertStatus, setAlertStatus] = useState("hide");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingFilesNames, setUploadingFilesNames] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    for (let i = 0; i < files.length; i++) {
      uploadFile(files[i]);
    }
  };

  const uploadFile = async (f) => {
    if (f.size > 104857600) {
      setAlertType("fail");
      setAlertMessage("File must be less than 100mb");
      setAlertStatus("show");
      setTimeout(() => {
        setAlertStatus("hide");
      }, 3000);
      setIsUploading(false);
      return;
    }
    const fileRef = ref(storage, `${params}/files/${f.name}`);
    await uploadBytes(fileRef, f).then(() => {
      setAlertType("success");
      setAlertMessage("File Uploaded");
      setAlertStatus("show");
      setTimeout(() => {
        setAlertStatus("hide");
      }, 3000);
      setFiles(null);
      onUpload();
      setIsUploading(false);
    });
  };

  const deleteFile = async (name) => {
    const deleteRef = ref(storage, `${params}/files/${name}`);
    await deleteObject(deleteRef)
      .then(() => {
        setAlertType("success");
        setAlertMessage("File Deleted");
        setAlertStatus("show");
        setTimeout(() => {
          setAlertStatus("hide");
        }, 3000);
      })
      .catch((err) => {
        setAlertType("fail");
        setAlertMessage(err.message);
        setAlertStatus("show");
        setTimeout(() => {
          setAlertStatus("hide");
        }, 3000);
      });
    onUpload();
  };

  const joinFileList = (List) => {
    let list = List[0].name;
    for (let i = 1; i < List.length; i++) {
      list = list + ", " + List[i].name;
    }
    setUploadingFilesNames(list);
  };

  return (
    <div>
      {alertStatus === "show" && (
        <Alert message={alertMessage} type={alertType} />
      )}

      <Container>
        <motion.form
          initial={{ scale: 0.7 }}
          animate={{ scale: 1, transition: 0.3 }}
        >
          {!files && (
            <label
              htmlFor="fileUpload"
              className="flex items-center bg-slate-800 px-4 text-slate-50 hover:scale-110 duration-300 active:scale-100 gap-2 mx-auto cursor-pointer py-2 my-7 rounded-3xl w-fit"
            >
              Upload
              <CirclePlus size={"20px"} />
            </label>
          )}
          <input
            id="fileUpload"
            type="file"
            onChange={(e) => {
              setFiles(e.target.files);
              joinFileList(e.target.files);
            }}
            files={files}
            className="hidden"
            multiple
          />
          {files && !isUploading && (
            <>
              <div className="flex items-center w-fit m-auto">
                <div className="flex item-center justify-between border border-slate-900 rounded-lg rounded-r-none px-2 py-1">
                  <p className="mr-3 w-[180px] whitespace-nowrap overflow-hidden">
                    {uploadingFilesNames}
                  </p>
                  <button onClick={() => setFiles(null)}>
                    <CirclePlus
                      size={"20px"}
                      className="rotate-45 cursor-pointer text-slate-700 hover:text-slate-950"
                    />
                  </button>
                </div>
                <button
                  onClick={submitHandler}
                  className="text-slate-50 bg-slate-800 text-sm active:bg-slate-800 hover:bg-optional border-2 rounded-lg rounded-l-none border-slate-800 m-1 ml-2 px-3 py-[5px]"
                >
                  Submit
                </button>
              </div>
            </>
          )}

          {isUploading && (
            <div className="flex items-center bg-slate-600 px-4 text-slate-50 duration-300 active:scale-100 gap-2 mx-auto cursor-pointer py-2 my-7 rounded-3xl w-fit">
              Uploading...
            </div>
          )}
        </motion.form>

        {fileList.length === 0 && (
          <div>
            <p className="text-center opacity-75">Upload your files</p>
          </div>
        )}

        <div className="md:w-1/2 mx-auto">
          {fileList.map((file) => (
            <motion.div
              key={file.url}
              initial={{ y: 40, opacity: "0.3" }}
              animate={{ y: 0, opacity: 1, transition: 0.6 }}
              className="group relative flex w-full overflow-x-hidden whitespace-nowrap items-center my-2 hover:bg-slate-600 hover:bg-opacity-25 rounded-xl p-2"
            >
              <File size={"20px"} />
              <p className="ml-1 w-[90%] overflow-x-hidden whitespace-nowrap">
                {file.name}
              </p>
              <div className="flex gap-2">
                <motion.button
                  animate={{ y: -5 }}
                  onClick={() => deleteFile(file.name)}
                  className="group-hover:flex hidden bg-slate-600 hover:bg-slate-400 hover:bg-opacity-75 bg-opacity-75 text-slate-50 hover:text-slate-800 active:bg-popacity active:text-slate-600 w-14 h-[35px] rounded-xl duration-300"
                  title="Delete file"
                >
                  <Trash size={"20px"} />
                </motion.button>
                <motion.button
                  animate={{ y: -5 }}
                  onClick={() => onDownload(true, file.name)}
                  className="group-hover:flex hidden bg-slate-600 z-20 hover:bg-slate-400 hover:bg-opacity-75 bg-opacity-75 text-slate-50 hover:text-slate-800 active:bg-popacity active:text-slate-600 w-14 h-[35px] rounded-xl duration-300 cursor-pointer"
                  title="Download file"
                >
                  <Download size={"20px"} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default ShareFile;
