"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function App(props: any) {
  const loc = usePathname();
  const a = { opened: false };

  if (loc == props.link) {
    console.log(props.link);
    a.opened = true;
  } else if (props.link == "/myself" && loc.startsWith("/profile")) {
    a.opened = true;
  } else if (props.link == "more" && loc.startsWith("/more")) {
    a.opened = true;
  } else if (props.link == "/myself" && loc == "/customize") {
    a.opened = true;
  } else {
    console.log("");
  }

  return (
    <Link
      href={props.link}
      className={`flex w-max cursor-pointer  flex-row content-center items-center  px-3 py-[6px] transition-all border   rounded-full h-[calc(11*4px)] md:h-max md:border-none md:rounded-full  duration-100 ease-linear md:mx-0 md:w-full md:space-x-[10px] md:pl-4 md:py-[14px] md:pr-8  ${
        a.opened ? "bg-gray-900/50" : ""
      }`}
    >
      <svg
        className={`h-[20px] w-[20px] stroke-[2px] p-[2px] text-white ${a.opened ? "text-white" : "text-gray-600"}`}
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
      >
        {props.url}
      </svg>

      {a.opened && <span className={"md:hidden px-2 text-xs font-pops text-white"}>{props.name}</span>}
      <span
        className={`font-pops hidden text-sm text-white md:inline-block ${
          a.opened ? "font-medium text-white" : "font-normal text-gray-600"
        } pt-[0px]`}
      >
        {props.name}
      </span>
    </Link>
  );
}
