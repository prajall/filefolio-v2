"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const InputForm = () => {
  const [customPath, setCustomPath] = useState("");
  const [randomId, setRandomId] = useState("");
  const router = useRouter();
  const getRandomId = () => {
    setRandomId("");
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let i;
    let id = "";
    for (i = 1; i <= 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      id += characters.charAt(randomIndex);
    }
    setRandomId(id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(customPath);
    getRandomId();
    router.push(`/${customPath ? customPath : randomId}`);
  };
  return (
    <motion.form
      className="flex gap-2 md:gap-4 w-fit mx-auto justify-center px-4 z-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <input
        placeholder="Custom Path ?"
        className="px-6 w-1/2 py-3 rounded-full bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors shadow-sm"
        onChange={(e) => {
          setCustomPath(e.target.value);
        }}
      />

      <button
        type="submit"
        onClick={handleSubmit}
        className="px-6 py-3 rounded-full bg-blue-700 text-white hover:bg-blue-800 cursor-pointer transition-colors shadow-md"
      >
        Share Now
      </button>
    </motion.form>
  );
};

export default InputForm;
