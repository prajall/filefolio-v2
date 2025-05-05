"use client";
import { Link } from "next/navigation";
import Logo from "./Logo";
import Container from "../homepage/components/Container";

const Navbar = () => {
  return (
    <div className="absolute top-0 left-0 z-20 w-full flex items-center py-5">
      <div className="w-full flex justify-between">
        {/* <Link href="/"> */}
        <Container>
          <Logo />
          {/* dkfk */}
          {/* </Link> */}
        </Container>
      </div>
    </div>
  );
};

export default Navbar;
