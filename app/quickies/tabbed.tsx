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
    <div className="flex flex-row flex-grow px-4 w-auto text-base font-medium text-white font-pops">
    <Link
      href="/quickies"
      className={`w-1/2 py-2 m-2 rounded-lg text-center ${pathname == "/quickies" ? "bg-neutral-700/30" : ""}`}
    >
      Following
    </Link>
    <Link
      href="/quickies/all"
      className={`w-1/2 py-2 m-2 rounded-lg text-center ${pathname == "/quickies/all" ? "bg-neutral-700/30" : ""}`}
    >
      Explore
    </Link>
            
  </div>
        </>}
  </>)
}