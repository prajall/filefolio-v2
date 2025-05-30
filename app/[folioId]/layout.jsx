"use client";
import React, { useEffect, useState } from "react";
import { db } from "../config/config";
import { getDocs, collection } from "firebase/firestore";
import { Loader2, Lock } from "lucide-react";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import axios from "axios";
import { set } from "mongoose";

export default function FolioLayout({ children, params }) {
  const [password, setPassword] = useState("");
  const [isLocked, setIsLocked] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unlock, setUnlock] = useState(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { folioId } = React.use(params);
  const passwordCollectionRef = collection(db, "password");

  const checkPrivacy = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/folio", {
        params: { folioId },
      });
      console.log("Folio response:", response.data);
      if (response.data?.folio) {
        const { password, locked } = response.data.folio;
        setPassword(password);
        setIsLocked(locked);
        if (locked) {
          setUnlock(false);
        } else {
          setUnlock(true);
        }
      } else {
        throw new Error("Folio not found");
      }
    } catch (error) {
      console.error("Error fetching folio privacy:", error);
      toast.error("Failed to fetch folio privacy");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    console.log("folioId:", folioId);
    try {
      setIsSubmitting(true);
      const response = await axios.post(`/api/folio/lock?folioId=${folioId}`, {
        password: passwordInput,
      });
      if (response.data?.success) {
        setUnlock(true);
        toast.success("Unlocked successfully");
      }
      if (response.status === 401) {
        toast.error("Incorrect password");
        setUnlock(false);
      }
      console.log("Password response:", response.data);
    } catch (error) {
      console.error("Error unlocking folio:", error);
      if (error.response?.status === 401) {
        toast.error("Incorrect password");
      } else if (error.response?.status === 500) {
        toast.error("Internal server error");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    checkPrivacy();
  }, []);

  return (
    <div>
      {!unlock && <Navbar />}
      {loading && (
        <div className="w-full h-[90vh] fixed top-0 flex justify-center items-center text-slate-900">
          Loading...
        </div>
      )}
      {unlock === null && !loading && (
        <div className="w-full h-screen fixed top-0 flex justify-center items-center">
          Error Generating this Page :(
        </div>
      )}
      {unlock === false && !loading && (
        <div className="w-full h-screen fixed top-0 flex justify-center items-center">
          <div className="password-container w-[300px] md:w-[400px] lg:w-[500px] border-2 rounded-xl px-2 py-5 justify-center text-center">
            <h3 className="text-2xl mb-2 font-bold flex gap-2 items-center justify-center">
              <Lock size={20} />
              Locked Folio
            </h3>
            <p>
              This Folio is locked. Please enter password to unlock the files
            </p>
            <form
              className="flex flex-col mx-auto w-52 md:w-60"
              onSubmit={handlePasswordSubmit}
            >
              <input
                type="password"
                className="border p-2 mt-3 text-sm rounded-lg w-full"
                placeholder="Password"
                onChange={(e) => setPasswordInput(e.target.value)}
                value={passwordInput}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-1 px-2 bg-slate-900 text-white w-full rounded-lg mt-3 cursor-pointer hover:bg-slate-800 active:bg-slate-950 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex gap-1 items-center justify-center"
              >
                Submit
                {isSubmitting && (
                  <Loader2 size={16} className="animate-spin mr-2" />
                )}
              </button>
            </form>
          </div>
        </div>
      )}
      {unlock === true && !loading && children}
    </div>
  );
}
