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
  } else if (props.link == "/more" && loc.startsWith("/more")) {
    a.opened = true;
  } else if (props.link == "/" && (loc == "/all" || loc == "/")) {
    a.opened = true;
  } else if (props.link == "/quickies" && (loc == "/quickies/all" || loc == "/quickies")) {
    a.opened = true;
  } else if (props.link == "/bookmarks" && (loc == "/bookmarks/quickies" || loc == "/bookmarks")) {
    a.opened = true;
  } else if (props.link == "/myself" && loc == "/customize") {
    a.opened = true;
  } else {
  }

  return (
    <Link
      href={props.link}
      className={`mx-2  flex cursor-pointer flex-row content-center items-center  h-[52px] w-[52px] transition-all   rounded-full md:rounded-full  md:h-max md:border-none  duration-100 ease-linear md:mx-0 md:w-full md:space-x-[10px] md:px-[14px] md:py-[10px] md:pr-8  ${
        a.opened ? "bg-neutral-700/30" : ""
      }`}
    >
      <svg
        className={`mx-auto text-white md:mx-0 md:h-[24px] md:w-[24px] h-[24px] w-[24px] stroke-[2px]`}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        {props.url}
      </svg>
      <span
        className={`font-pops font-normal hidden text-sm md:text-base text-black md:inline-block ${
          a.opened ? "font-medium text-white" : "font-medium text-white"
        } pt-[0px]`}
      >
        {props.name}
      </span>
    </Link>
  );
}
