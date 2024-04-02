"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function App(props:any) {
  const loc = usePathname();
  const a = { opened: false };

  if (loc == props.link) {
    console.log(props.link);
    a.opened = true;
  } else if (props.link == "/myself" && loc.startsWith("/profile")) {
    a.opened = true;
  }
  else if (props.link == 'more' && loc.startsWith("/more")) {
    a.opened = true;
  }
  else if (props.link == "/myself" && loc == "/customize") {
    a.opened = true;
  } else {
    console.log("");
  }

  return (
    <Link
      href={props.link}
      className={`mx-2  flex w-max cursor-pointer flex-row content-center items-center  px-3  py-[10px] transition-all bg-gray-800/10 md:bg-transparent rounded-lg h-[calc(13*4px)] md:h-max md:border-none  duration-100 ease-linear md:mx-0 md:w-full md:space-x-[10px] md:px-[14px] md:py-[10px] md:pr-8  ${
        a.opened ? "md:bg-gray-900/50 bg-gray-800/40" : ""
      }`}
    >
      <svg
        className={`h-[26px] md:h-[24px] md:w-[24px] w-[26px] stroke-[2px] p-[2px] text-gray-200 ${a.opened ? "text-gray-400" : "text-gray-500"}`}
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
      >
        {props.url}
      </svg>
      <span
        className={`font-inter font-medium hidden text-sm text-black md:inline-block ${
          a.opened ? "font-medium text-gray-200" : "font-medium text-gray-200"
        } pt-[0px]`}
      >
        {props.name}
      </span>
    </Link>
  );
}
