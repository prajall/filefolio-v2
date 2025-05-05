import React, { useEffect, useState } from "react";
import {
  uploadBytes,
  ref,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";
import { storage } from "../config/config";
import { useParams } from "react-router-dom";
import { AiFillFile, AiOutlineCloseCircle, AiFillDelete } from "react-icons/ai";
import { BsPlusCircleDotted } from "react-icons/bs";
import Alert from "../components/Alert";
import { motion } from "framer-motion";

const ShareFile = ({ fileList, onUpload, onDownload }) => {
  const [files, setFiles] = useState(null);
  const params = useParams().id;
  const [alertStatus, setAlertStatus] = useState("hide");
  const [alertMessage, setAlertMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingFilesNames, setUploadingFilesNames] = useState("");

  const submitHandler = async (e) => {
    event.preventDefault();
    setIsUploading(true);

    for (let i = 0; i < files.length; i++) {
      uploadFile(files[i]);
    }
  };

  const uploadFile = async (f) => {
    console.log(f);
    if (f.size > 104857600) {
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
    console.log(name);
    await deleteObject(deleteRef)
      .then(() => {
        setAlertMessage("File Deleted");
        setAlertStatus("show");
        setTimeout(() => {
          setAlertStatus("hide");
        }, 3000);
      })
      .catch((err) => {
        setAlertMessage(err);
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
      {alertStatus === "show" && <Alert message={alertMessage} />}
      {/* =========== UPLOAD BUTTON ============== */}
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
            <BsPlusCircleDotted size={"20px"} />
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
        {/* ================== SUBMIT BUTTON =================== */}
        {files && !isUploading && (
          <>
            <div className="flex items-center w-fit m-auto ">
              <div className="flex item-center justify-between border rounded-lg rounded-r-none px-2 py-1 ">
                <p className="mr-3 w-[180px] whitespace-nowrap overflow-hidden">
                  {/* {files.length > 1 && file.name + " , ..."}
                  {files.length == 1 && file.name} */}
                  {uploadingFilesNames}
                </p>
                <button
                  onClick={() => {
                    setFiles(null);
                  }}
                >
                  <AiOutlineCloseCircle size={"20px"} />
                </button>
              </div>
              <button
                onClick={submitHandler}
                className="text-slate-50 bg-slate-900 text-sm active:bg-slate-800 border-2 rounded-lg rounded-l-none border-slate-800 m-1 ml-2 px-3 py-[5px]"
              >
                Submit
              </button>
            </div>
          </>
        )}

        {/* ================= UPLOADING BUTTON ====================== */}

        {isUploading && (
          <div className="flex items-center bg-slate-600 px-4 text-slate-50 duration-300 active:scale-100 gap-2 mx-auto cursor-pointer py-2 my-7 rounded-3xl w-fit">
            Uploading...
            {/* <BsPlusCircleDotted size={"20px"} /> */}
          </div>
        )}
      </motion.form>
      {fileList.length === 0 && (
        <div>
          <p className="text-center opacity-75">Upload your files</p>
        </div>
      )}
      {/* ============= FILE PREVIEWS =============== */}
      <div className="md:w-1/2 mx-auto">
        {fileList.map((file) => {
          return (
            <motion.div
              key={file.url}
              initial={{ y: 40, opacity: "0.3" }}
              animate={{ y: 0, opacity: 1, transition: 0.6 }}
              className="flex w-full overflow-x-hidden whitespace-nowrap items-center my-2 cursor-pointer hover:bg-slate-600 hover:bg-opacity-25 rounded-xl p-2 "
              onClick={() => {
                onDownload(true, file.name);
              }}
            >
              <AiFillFile />
              <p className="ml-1 w-[90%] overflow-x-hidden whitespace-nowrap">
                {file.name}
              </p>
              <button
                // onClick={() => deleteFile(file.name)}
                // onClick = {()=>{onDownload}}
                className=" p-1 hover:bg-slate-50 rounded-md hover:bg-opacity-50"
              >
                <AiFillDelete size={"20px"} />
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ShareFile;
