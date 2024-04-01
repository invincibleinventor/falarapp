import Headeritem from "@/components/HeaderItem";
import Link from "next/link";
import Trending from "./Trending";
export default function Sidebar() {
  return (
    <div className="mb-auto xl:ml-1 lg:block hidden lg:w-[500px] xl:w-[600px]">
      <div className={`  flex w-full flex-col items-start p-0 md:pr-0 `}>
       
        <div className="w-full flex flex-col space-y-1 py-4 pt-[14px] md:mt-[calc(18.5*4px)] md:space-y-[0px] md:bg-gray-100 md:px-4 md:pt-[4px]">
          <Trending/>
        </div>
      </div>
    </div>
  );
}
