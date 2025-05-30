import axios from "axios";
import { motion } from "framer-motion";
import { ChevronDown, Copy, Lock } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
// import Alert from "./Alert";

const Private = () => {
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");
  const [dropdown, setDropdown] = useState(false);

  // const [alert, setAlert] = useState({ status: "hide", message: "", type: "" });

  const params = useParams();

  const getPrivate = async () => {
    try {
      const response = await axios.get("/api/folio/lock", {
        params: { folioId: params.folioId },
      });
      console.log("Folio response:", response.data);
      if (response.data) {
        const { locked } = response.data;
        setIsPrivate(locked);
      } else {
        throw new Error("Folio not found");
      }
    } catch (error) {
      console.error("Error fetching folio:", error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        "/api/folio/lock?folioId=" + params.folioId,
        {
          password: password,
          locked: isPrivate,
        }
      );
      console.log("Response from server:", response.data);
      if (response.status === 200) {
        toast.success("Saved");
        setDropdown(false);
      }
    } catch (error) {
      console.error("Error saving privacy settings:", error);
      toast.error("Failed to save privacy settings");
    }
  };
  const handleCheckbox = (e) => {
    setIsPrivate(e.target.checked);
  };
  const handleDropdown = () => {
    if (dropdown) {
      setDropdown(false);
    } else setDropdown(true);
  };

  const shareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  useEffect(() => {
    getPrivate();
  }, []);

  return (
    <>
      {/* {alertStatus === "show" && (
        <Alert message={alertMessage} type={alertType} />
      )} */}
      <div className="flex gap-2">
        <div className="locked-folio border-2 lg:border-none rounded-xl p-1">
          <button
            onClick={handleDropdown}
            className="flex p-1 rounded-lg items-center cursor-pointer"
          >
            <div className="hidden lg:flex">Private Folio</div>
            <div className="flex lg:hidden">
              <Lock size={"16px"} />
            </div>
            <ChevronDown size={"16px"} />
          </button>

          {dropdown && (
            <motion.div
              initial={{ y: -30 }}
              animate={{ y: 0 }}
              className="config absolute w-40 md:w-48 lg:w-52 py-3 px-2 mt-3 -ml-16 md:-ml-24 lg:-ml- text-sm bg-slate-50 border-2 rounded-lg z-10"
            >
              <div className="flex items-center justify-between">
                Lock
                <label className="toggle-container">
                  <input
                    type="checkbox"
                    className="toggle-input"
                    checked={isPrivate}
                    onChange={(e) => {
                      handleCheckbox(e);
                    }}
                  />
                  <div className="toggle-button">
                    <div className="toggle-switch"></div>
                  </div>
                </label>
              </div>
              <div className="password mt-2">
                <input
                  type="text"
                  placeholder="password"
                  className="w-full focus:outline-none border-2 rounded-lg text-sm p-1 px-2"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  value={password}
                />
                <button
                  onClick={handleSave}
                  className="bg-slate-800 text-slate-50 py-1 w-full mt-2 rounded-lg"
                >
                  Save
                </button>
              </div>
            </motion.div>
          )}
        </div>
        <button
          onClick={shareLink}
          className="copy-link  flex items-center bg-slate-800 hover:bg-slate-900 active:bg-slate-950 hover:bg-opacity-90 duration-300 px-4 rounded-xl cursor-pointer text-slate-50"
        >
          <Copy size={"16px"} />
          <p className="ml-2 hidden lg:flex ">Copy Link</p>
        </button>
      </div>
    </>
  );
};

export default Private;
