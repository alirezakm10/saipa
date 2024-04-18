import Logo from "@/components/formBuilder/Logo";
import ThemeSwitcher from "@/components/formBuilder/ThemeSwitcher";
// import { UserButton } from "@clerk/nextjs";
import React, { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className=" relative flex flex-col min-h-screen min-w-full bg-background max-h-screen overflow-auto">  
      <main className="flex w-full flex-grow">{children}</main>
    </div>
  );
}

export default Layout;
