"use client";
import React, { useEffect, useState } from "react";
import { db } from "../config/config";
import { getDocs, collection } from "firebase/firestore";
import { Lock } from "lucide-react";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import axios from "axios";
import { set } from "mongoose";

export default function FolioLayout({ children, params }) {
  const [password, setPassword] = useState("");
  const [isPrivate, setIsPrivate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unlock, setUnlock] = useState(null);
  const [passwordInput, setPasswordInput] = useState("");

  const { folioId } = React.use(params);
  const passwordCollectionRef = collection(db, "password");

  const checkPrivacy2 = async () => {
    console.log("Checking privacy for folioId:", folioId);
    const data = await getDocs(passwordCollectionRef);
    let databaseExist = false;
    const filteredData = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    filteredData.forEach((data) => {
      if (data.id === folioId) {
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
        setIsPrivate(locked);
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

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === password) {
      setUnlock(true);
    } else {
      toast.error("incorrect password");
      setPasswordInput("");
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
                className="py-1 px-2 bg-slate-900 text-white w-full rounded-lg mt-3 cursor-pointer"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
      {unlock === true && !loading && children}
    </div>
  );
}
