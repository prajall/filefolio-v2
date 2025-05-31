"use client";
import { useEffect, useState } from "react";
// import Alert from "../components/Alert";
import axios from "axios";
import { Copy } from "lucide-react";
import { toast } from "react-hot-toast";

const ShareCode = ({ data = "", folioId }) => {
  const [message, setMessage] = useState(data || "");

  const handleSubmit = async () => {
    event.preventDefault();
    try {
      const response = await axios.post("/api/code", {
        folioId,
        code: message,
      });
      console.log(response);
      toast.success("Code updated");
    } catch (error) {
      console.log(error);
      toast.error("Error updating code");
    }
  };

  useEffect(() => {
    console.log("Data received in ShareCode:", data);
    setMessage(data);
  }, [data]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
          type="submit"
          className="border px-4 py-1 mb-4 hover:bg-slate-900 active:bg-slate-950 rounded-md bg-slate-800 text-blue-50 cursor-pointer"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ShareCode;
