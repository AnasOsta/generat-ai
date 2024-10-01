import React from "react";
import { UserButton } from "@clerk/nextjs";
import MobileSideBar from "./mobileSideBar";

export default function Navbar() {
  return (
    <div className="flex items-center p-4">
      <MobileSideBar />
      <div className="flex w-full justify-end">
        <UserButton afterSwitchSessionUrl="/" />
      </div>
    </div>
  );
}
