"use client";
import React, { useEffect, useState } from "react";
import { uploadBytes, ref, deleteObject } from "firebase/storage";
import { storage } from "../../config/config";
import { useParams } from "next/navigation";
import { CirclePlus, Trash, File, Download } from "lucide-react";
import { motion } from "framer-motion";
import Container from "../../components/Container";
import toast from "react-hot-toast";
import axios from "axios";

const ShareFile = ({ fileList, onUpload, onDownload, folioId }) => {
  const [files, setFiles] = useState(null);
  const params = useParams().id;
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingFilesNames, setUploadingFilesNames] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    // setIsUploading(true);

    // for (let i = 0; i < files.length; i++) {
    //   uploadFile(files[i]);
    // }
    uploadFiles();
  };

  const uploadFiles = async () => {
    if (!files) return;

    for (const file of Array.from(files)) {
      if (file.size > 100 * 1024 * 1024) {
        toast.error("File size must be less than 100MB.");
        setFiles(null);
        return;
      }
    }
    console.log("Uploading files:", files);

    try {
      setIsUploading(true);
      // Request signed URLs for each file
      const res = await axios.post("/api/file", {
        folder: `${folioId}/files`,
        files: Array.from(files).map((f) => ({
          name: f.name,
          type: f.type,
        })),
      });
      const { urls } = res.data;

      // Upload files to signed URLs
      const response = await Promise.all(
        urls.map(({ url, fileName }) => {
          const file = Array.from(files).find((f) => f.name === fileName);
          if (!file) return;
          return axios.put(url, file, {
            headers: {
              "Content-Type": file.type,
            },
          });
        })
      );
      console.log("Upload responses:", response);
      toast.success(
        `${files.length === 1 ? "File" : "Files"} uploaded successfully!`
      );
      onUpload();
    } catch (error) {
      console.log("Error uploading files:", error);
      toast.error("Error uploading files. Please try again.");
    } finally {
      setIsUploading(false);
      setFiles(null);
      setUploadingFilesNames("");
    }
  };

  // const uploadFile = async (f) => {
  //   if (f.size > 104857600) {
  //     toast.error("File must be less than 100mb");
  //     setIsUploading(false);
  //     return;
  //   }
  //   const fileRef = ref(storage, `${params}/files/${f.name}`);
  //   await uploadBytes(fileRef, f).then(() => {
  //     toast.success("File Uploaded");

  //     setFiles(null);
  //     onUpload();
  //     setIsUploading(false);
  //   });
  // };

  const deleteFile = async (name) => {
    const deleteRef = ref(storage, `${params}/files/${name}`);
    await deleteObject(deleteRef)
      .then(() => {
        toast.success("File Deleted");
      })
      .catch((err) => {
        toast.error(err.message);
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

  useEffect(() => {
    console.log("File List:", fileList);
  }, []);

  return (
    <div>
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
                  <CirclePlus size={"20px"} />
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
              key={file}
              initial={{ y: 40, opacity: "0.3" }}
              animate={{ y: 0, opacity: 1, transition: 0.6 }}
              className="flex w-full overflow-x-hidden whitespace-nowrap items-center my-2 cursor-pointer hover:bg-gray-300 hover:bg-opacity-25 rounded-xl p-2 "
              onClick={() => {
                onDownload(true, file.name);
              }}
            >
              <File size={"20px"} />
              <p className="ml-1 w-[90%] overflow-x-hidden whitespace-nowrap">
                {file}
              </p>
              <button
                // onClick={() => deleteFile(file.name)}
                // onClick = {()=>{onDownload}}
                className=" p-1 hover:bg-slate-50 rounded-md hover:bg-opacity-50"
              >
                <Trash size={"20px"} />
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ShareFile;
