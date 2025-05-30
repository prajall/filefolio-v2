"use client";
import { Link } from "next/navigation";
import Logo from "./Logo";
import Container from "./Container";

const Navbar = () => {
  return (
    <div className="absolute top-0 left-0 z-20 w-full flex items-center py-5">
      <div className="w-10/12 mx-auto flex ">
        {/* <Link href="/"> */}

        <Logo />
        {/* dkfk */}
        {/* </Link> */}
      </div>
    </div>
  );
};

export default Navbar;
