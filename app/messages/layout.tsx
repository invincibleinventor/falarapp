'use client';
import SettingsBar from "@/components/MessageBar";
import "../globals.css";
import { useState } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const [barOpened,setBarOpened] = useState(true)
  return (
    <main>
      <section className="relative flex flex-row items-center content-center h-screen overflow-hidden ">
        <div className={`w-full h-full mt-0 overflow-hidden border-r md:w-56 hiddenscroll border-r-neutral-800 ${barOpened?'':'hidden'}`}>
        <SettingsBar  opened={setBarOpened} />

        </div>
        <div className="flex-1 w-full px-0 backdrop-blur-md md:border-none pt-14">{children}</div>

      </section>
    </main>
  );
}
