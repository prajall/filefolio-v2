import { useEffect, useState, useRef } from "react";

export default function FullScreenDropzone({ onDropFiles }) {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  useEffect(() => {
    const handleDragEnter = (e) => {
      e.preventDefault();
      dragCounter.current += 1;
      setIsDragging(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      dragCounter.current -= 1;
      if (dragCounter.current <= 0) {
        setIsDragging(false);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      dragCounter.current = 0;
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files || []);
      if (files.length > 0) {
        onDropFiles?.(files);
      }
    };

    const handlePaste = (e) => {
      const files = Array.from(e.clipboardData?.files || []);
      if (files.length > 0) {
        onDropFiles?.(files);
      }
    };

    const handleDragOver = (e) => e.preventDefault();

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDrop);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDrop);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("paste", handlePaste);
    };
  }, [onDropFiles]);

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen z-50 pointer-events-none flex items-center justify-center transition-opacity duration-300 bg-neutral-50/50 backdrop-blur-sm ${
        isDragging ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="bg-slate-100/70 border-4 border-dashed border-slate-400 rounded-xl px-8 py-6 text-xl font-semibold text-slate-800">
        Drop or Paste files anywhere
      </div>
    </div>
  );
}
