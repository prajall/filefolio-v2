"use client";
import React, { useEffect, useState } from "react";
import { setDoc } from "firebase/firestore";
// import Alert from "../components/Alert";
import { Copy } from "lucide-react";
import { toast } from "react-hot-toast";

const ShareCode = ({ data, docRef }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    event.preventDefault();
    try {
      const response = await setDoc(docRef, { message: message });
      console.log(response);
      toast.success("Code updated");
    } catch (error) {
      toast.error("Error updating code");
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
      {/* {alertStatus === "show" && (
        <Alert message="Code Updated" type={"success"} />
      )} */}
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
            <Copy size={"20px"} />
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
