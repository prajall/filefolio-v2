import React, { useState, useEffect, use } from "react";
import { useParams } from "next/navigation";
import { uploadBytes, ref, deleteObject } from "firebase/storage";
import { storage } from "../../config/config";
import { CirclePlus, Trash } from "lucide-react";

import { motion } from "framer-motion";
import { Download } from "lucide-react";
import Container from "../../components/Container";
import toast from "react-hot-toast";
import axios from "axios";
import FullScreenDropzone from "./FullScreenDropZone";

const ShareImage = ({ imageList, onUpload, onDownload, folioId, onDelete }) => {
  const [images, setImages] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingImagesNames, setUploadingImagesNames] = useState("");

  const uploadImages = async () => {
    console.log("Uploading images:", images);
    for (const image of Array.from(images)) {
      if (!image.type.startsWith("image/")) {
        toast.error("Please select image files only.");
        setImages(null);
        return; // This now properly exits uploadImages
      }
      if (image.size > 100 * 1024 * 1024) {
        // 100MB limit
        toast.error(` Image size must be less than 100MB.`);
        return;
      }
    }

    try {
      setIsUploading(true);
      const res = await axios.post("/api/file", {
        folder: `${folioId}/images`,
        files: Array.from(images).map((f) => ({
          name: f.name,
          type: f.type,
        })),
      });
      console.log("Received signed URLs:", res.data);
      const { urls } = res.data;

      // Step 2: Upload files to signed URLs
      await Promise.all(
        urls.map(({ url, fileName }) => {
          console.log("Uploading to URL:", url);
          console.log("fileName from URL:", fileName);
          console.log("fileName of file:", images);
          const file = Array.from(images).find((f) => f.name === fileName);
          if (!file) return;

          console.log("Uploading file:", fileName);

          return axios.put(url, file, {
            headers: {
              "Content-Type": file.type,
            },
          });
        })
      );

      toast.success(
        `${images.length === 1 ? "Image" : "Images"} uploaded successfully!`
      );
      onUpload();
    } catch (error) {
      console.log("Error uploading files:", error);
      toast.error("Error uploading files. Please try again.");
    } finally {
      setIsUploading(false);
      setImages(null);
      setUploadingImagesNames("");
    }
  };

  const submitHandler = async () => {
    event.preventDefault();
    uploadImages();
  };

  const joinImageList = (List) => {
    console.log(List);
    let list = List[0].name;
    for (let i = 1; i < List.length; i++) {
      list = list + ", " + List[i].name;
    }
    console.log(list);
    setUploadingImagesNames(list);
  };

  // useEffect to log imageList whenever it changes
  useEffect(() => {
    if (images && images.length > 0) {
      joinImageList(images);
    }
  }, [images, setImages]);

  useEffect(() => {
    console.log("Image List:", imageList);
  }, [imageList]);
  return (
    <div>
      <FullScreenDropzone onDropFiles={(images) => setImages(images)} />

      <Container>
        <motion.form
          initial={{ scale: 0.7 }}
          animate={{ scale: 1, transition: 0.3 }}
        >
          {!images && (
            <label
              htmlFor="imageUpload"
              className="flex items-center bg-slate-800 px-4 text-slate-50 hover:scale-110 duration-300 active:scale-100 gap-2 mx-auto cursor-pointer h-10 my-7 rounded-3xl w-fit"
            >
              Upload
              <CirclePlus size={"20px"} />
            </label>
          )}
          <input
            id="imageUpload"
            type="file"
            onChange={(e) => {
              // setImage(e.target.files[0]);
              setImages(e.target.files);
              joinImageList(e.target.files);
            }}
            files={images}
            className="hidden"
            multiple
          />
          {/* ================== SUBMIT BUTTON =================== */}
          {images && !isUploading && (
            <>
              <div className="flex items-center w-fit m-auto h-10 my-7">
                <div className="flex item-center justify-between border border-slate-900 rounded-lg rounded-r-none px-2 py-1 ">
                  <p className="mr-3 w-[180px] whitespace-nowrap overflow-hidden">
                    {uploadingImagesNames}
                  </p>
                  <button
                    onClick={() => {
                      setImages(null);
                    }}
                  >
                    <CirclePlus
                      size={"20px"}
                      className="rotate-45 cursor-pointer text-slate-700 hover:text-slate-950"
                    />
                  </button>
                </div>
                <button
                  onClick={submitHandler}
                  className="text-slate-50 cursor-pointer bg-slate-800 text-sm active:bg-slate-800 hover:bg-optional border-2 rounded-lg rounded-l-none border-slate-800  ml-1 px-3 py-[5px]"
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

        {imageList.length === 0 && (
          <div>
            <p className="text-center opacity-75">Upload your images</p>
          </div>
        )}

        {/* ======================= Image List ======================= */}
        <div className="masonry mt-6 ">
          {imageList.map((image) => {
            return (
              <motion.div
                key={image}
                className="group relative mb-3 image-container h-fit flex flex-col w-full mx-auto "
                initial={{ y: 40, opacity: "0.3" }}
                animate={{ y: 0, opacity: 1, transition: 0.7 }}
              >
                <img
                  src={image}
                  alt="image"
                  className="w-full h-full mx-auto rounded-xl "
                  key={image}
                />
                {/* <div className="absolute bottom-10 left-0 z-20"> */}
                <motion.button
                  animate={{ y: -5 }}
                  onClick={() => {
                    // deleteImage(image.name);
                    onDelete(image);
                    // onDownload(false, image.name);
                  }}
                  title="Delete image"
                  className=" group-hover:flex hidden cursor-pointer items-center justify-center absolute top-[10px] right-[10px] z-10 lg:hidden bg-slate-800 hover:bg-slate-700 hover:bg-opacity-75 bg-opacity-75 text-slate-50 active:bg-popacity active:text-slate-600 w-14 h-[35px] rounded-xl duration-300"
                >
                  <Trash size={"20px"} />
                </motion.button>
                <motion.button
                  animate={{ y: -5 }}
                  onClick={() => {
                    // deleteImage(image.name);
                    onDownload(image);
                  }}
                  className="group-hover:flex hidden gap-2 cursor-pointer items-center justify-center absolute bottom-[10px] right-1/2 translate-x-1/2 z-10 bg-slate-800/70 hover:bg-slate-700  hover:bg-opacity-75  bg-opacity-75 text-slate-50 active:bg-popacity active:text-slate-600 px-6 py-3  rounded-xl duration-300"
                  title="Download image"
                >
                  Download
                  <Download size={"20px"} />
                </motion.button>
                {/* </div> */}
              </motion.div>
            );
          })}
        </div>
      </Container>
    </div>
  );
};

export default ShareImage;
