import React, { useEffect, useState } from "react";
import { setDoc } from "firebase/firestore";
import Alert from "../components/Alert";
import { BiCopy } from "react-icons/bi";
import { motion } from "framer-motion";

const ShareCode = ({ data, docRef }) => {
  const [message, setMessage] = useState("");
  const [alertStatus, setAlertStatus] = useState("hide");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const handleSubmit = async () => {
    event.preventDefault();
    try {
      await setDoc(docRef, { message: message });
      setAlertMessage("Code Updated");
      setAlertType("success");
      setAlertStatus("show");
      setTimeout(() => {
        setAlertStatus("hide");
      }, 3000);
    } catch (error) {
      setAlertMessage("Failed to update code");
      setAlertType("success");
      setAlertStatus("fail");
      setTimeout(() => {
        setAlertStatus("hide");
      }, 3000);
    }
  };

  useEffect(() => {
    setMessage(data.message);
  }, [data]);

  useEffect(() => {
    setMessage(data.message);
  }, []);

  return (
    <div>
      {alertStatus === "show" && (
        <Alert message="Code Updated" type={"success"} />
      )}
      <form>
        <div className="relative">
          <textarea
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            value={message}
            className="border-2 border-gray-400 bg-slate-50 rounded w-full h-[75vh] p-3 font-semibold text-slate-800 resize-none font text-sm"
            spellCheck="false"
            placeholder="Share your code..."
          />
          <button
            onClick={() => {
              event.preventDefault();
              navigator.clipboard.writeText(message);
            }}
            title="Copy to clipboard"
            className="absolute top-3 right-3 bg-blue-50 hover:bg-slate-600 hover:text-blue-50 active:bg-slate-800 duration-200 rounded p-1"
          >
            <BiCopy size={"20px"} />
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="border px-2 py-1 mb-4 rounded bg-slate-800 text-blue-50"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ShareCode;
