"use client";
import Search from "@/components/SearchComponent";
import { AppConfig } from "@/config/config";

import Link from "next/link";
import { usePathname } from "next/navigation";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="overflow-hidden flex-1 p-0 py-2 h-screen">
            <div className="p-4 py-2 pb-2 mx-1 md:mx-1">

      {pathname=='/bookmarks' &&
                  <Search page="bookmarks" text="Bookmarked Posts" />

      }
      {pathname=="/bookmarks/quickies" &&
                      <Search page="quickiebookmarks" text="Bookmarked Quickies" />

      }
     </div>
     <h1 className="px-8 my-4 mt-4 text-xl font-medium text-neutral-300">My Bookmarks</h1>

      <div className="flex flex-row flex-grow w-auto text-base font-medium text-white font-pops">
        <Link href="/bookmarks" className={`w-1/2 py-4 text-center ${pathname == "/bookmarks" ? "border-b-2 border-b-primary-800" : ""}`}>
          Posts
        </Link>
        <Link
          href="/bookmarks/quickies"
          className={`w-1/2 py-4 text-center ${pathname == "/bookmarks/quickies" ? "border-b-2 border-b-primary-800" : ""}`}
        >
          Quickies
        </Link>
      </div>
      {children}
    </div>
  );
}
