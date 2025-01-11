'use client';
import Search from "@/components/SearchComponent";
import { AppConfig } from "@/config/config";
import Link
 from "next/link"
 import { usePathname } from "next/navigation"
export default function Tabbed(){
    const pathname = usePathname();
    
    return (
        <>
        {(pathname == '/quickies' || pathname == '/quickies/all') &&

        <>
        
        <div className="p-4 py-4 pb-2 mx-1 md:mx-1">
        <Search page="quickies" text={AppConfig.title} />
        </div>
    <div className="flex flex-row flex-grow w-auto text-sm font-medium text-white font-inter">
    <Link
      href="/quickies"
      className={`w-1/2 py-4 text-center ${pathname == "/quickies" ? "border-b-2 border-b-primary-800" : ""}`}
    >
      Following
    </Link>
    <Link
      href="/quickies/all"
      className={`w-1/2 py-4 text-center ${pathname == "/quickies/all" ? "border-b-2 border-b-primary-800" : ""}`}
    >
      Explore
    </Link>
            
  </div>
        </>}
  </>)
}