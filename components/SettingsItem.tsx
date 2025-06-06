"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function App(props: any) {
  const loc = usePathname();
  const a = { opened: false };

  if (loc == props.link) {
    a.opened = true;
  } else if (props.link == "/myself" && loc.startsWith("/profile")) {
    a.opened = true;
  } else if (props.link == "more" && loc.startsWith("/more")) {
    a.opened = true;
  } else if (props.link == "/myself" && loc == "/customize") {
    a.opened = true;
  } else {
  }

  return (
    <Link
      href={props.link}
      className={`flex w-max cursor-pointer rounded-xl  flex-row content-center items-center  px-3 py-[6px] transition-all    h-[calc(11*4px)]   duration-100 ease-linear md:mx-0 md:w-full md:space-x-[10px] md:pl-4 md:py-[14px] md:pr-8  ${
        a.opened ? "bg-neutral-700/30 " : ""
      }`}
    >
      <svg
        className={`h-[20px] w-[20px] stroke-[2px] p-[2px] text-white ${a.opened ? "text-white" : "text-neutral-400"}`}
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
      >
        {props.url}
      </svg>

      {a.opened && <span className={"px-2 text-sm text-white md:hidden font-pops"}>{props.name}</span>}
      <span
        className={`font-pops hidden text-sm text-white md:inline-block ${
          a.opened ? "font-medium text-white" : "font-normal text-neutral-400"
        } pt-[0px]`}
      >
        {props.name}
      </span>
    </Link>
  );
}
