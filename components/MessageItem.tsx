"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MessageItem(props: any) {
  const loc = usePathname();
  const a = { opened: false };

  if (loc == props.link) {
    a.opened = true;
  }

  return (
    <div
      onClick={props.onClick}
      className={`flex flex-row items-center content-center w-full px-6 py-4 space-x-4 ${a.opened ? "bg-[#131313]" : "bg-transparent"}`}
    >
      <img className="w-8 h-8 border rounded-full border-neutral-700 " src={props.dp}></img>
      <div className="flex flex-col space-y-[2px]">
        <h1 className="text-base font-semibold text-white md:text-sm">{props.name}</h1>
        <h1 className="text-sm text-neutral-400 md:text-sm">{props.message}</h1>
      </div>
    </div>
  );
}
