"use client";
import Search from "@/components/SearchComponent";
import { AppConfig } from "@/config/config";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex-1 h-screen p-0 py-2 overflow-hidden">
      <div className="p-4 py-2 pb-2 mx-1 md:mx-1">
        <Search page="quickies" text={AppConfig.title} />
      </div>
      <div className="flex flex-row flex-grow w-auto text-sm font-medium text-white font-inter">
        <Link
          href="/quickies"
          className={`w-1/2 py-4 text-center ${pathname == "/quickies" ? "border-b-2 border-b-cyan-800" : ""}`}
        >
          Following
        </Link>
        <Link
          href="/quickies/all"
          className={`w-1/2 py-4 text-center ${pathname == "/quickies/all" ? "border-b-2 border-b-cyan-800" : ""}`}
        >
          Explore
        </Link>
      </div>
      {children}
    </div>
  );
}
