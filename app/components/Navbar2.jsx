import React, { useEffect } from "react";
import Logo from "./Logo";
import { Link } from "next/navigation";
import Private from "./Private";

const Navbar2 = () => {
  return (
    <div className="w-full flex items-center py-5 z-20">
      <div className="w-10/12 mx-auto flex justify-between">
        {/* <Container> */}
        <div className="w-fit">
          {/* <Link href="/"> */}
          <Logo />
          {/* </Link> */}
        </div>
        {/* </Container> */}
        <div>
          <Private />
        </div>
      </div>
    </div>
  );
};

export default Navbar2;
