"use client";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function App(props: any) {
  const loc = usePathname();
  const a = { opened: false };
  const supabase = createClient();
  const [notifications, setNotifications] = useState(props.notifications);
  function deploy(payload: any) {
    if (payload.new.id == props.id && payload.new.notifications > 0) {
      setNotifications(payload.new.notifications);
    }
  }
  supabase
    .channel("notification_update")
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "user" },
      (payload: any) => (console.log("beloww"), console.log(payload), deploy(payload))
    )
    .subscribe();
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
    <div className="relative">
      {notifications > 0 && (
        <div className="absolute top-0 font-medium left-1 flex items-center content-center px-2 py-1 text-[10px] text-white rounded-full min-w-6 bg-cyan-700 aspect-video">
          <h1 className="mx-auto">{notifications}</h1>
        </div>
      )}
      <Link
        href={props.link}
        className={`mx-2  flex w-max cursor-pointer flex-row content-center items-center  px-3  py-[10px] transition-all bg-gray-800/10 md:bg-transparent rounded-full md:rounded-full h-[calc(13*4px)] md:h-max md:border-none  duration-100 ease-linear md:mx-0 md:w-full md:space-x-[10px] md:px-[14px] md:py-[10px] md:pr-8  ${
          a.opened ? "md:bg-gray-700/30 bg-gray-800/40" : ""
        }`}
      >
        <svg
          className={`h-[22px] md:h-[22px] md:w-[22px] w-[26px] stroke-[2px] pb-[2px] text-gray-400 ${a.opened ? "text-gray-400 md:text-gray-200" : "md:text-gray-200"}`}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 128 128"
        >
          {props.url}
        </svg>
        <span
          className={`font-inter font-medium hidden text-sm md:text-base text-black md:inline-block ${
            a.opened ? "font-medium text-white" : "font-medium text-gray-200"
          } pt-[0px]`}
        >
          {props.name}
        </span>
      </Link>
    </div>
  );
}
