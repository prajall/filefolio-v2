import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <>
      <Link
        href="/"
        className="logo w-fit text-sm py-2 px-1 rounded-lg border-2 border-slate-700 "
      >
        <span className="mr-1 font-semibold ml-[1px] text-slate-900">File</span>
        <span className="bg-slate-700 text-slate-50 rounded-md p-1 px-2 mr-[1px] font-bold">
          Folio
        </span>
      </Link>
    </>
  );
};

export default Logo;
