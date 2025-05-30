"use client";
import { useState } from "react";
export default function Search(props: any) {
  const [value, setValue] = useState("");
  function search() {
    console.log("ok");
    window.location.replace("/search/" + props.page + "/" + value);
  }
  return (
    <div className="relative items-center content-center lg:pr-0">
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="md:bottom-3 absolute inset-y-0 right-0 my-auto mr-6 md:mr-10 lg:mr-6 h-[14px] w-[14px] text-neutral-400"
      >
        <g>
          <path
            fill="currentColor"
            d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"
          ></path>
        </g>
      </svg>
      <input
        onKeyDown={(e) => {
          if (e.key === "Enter") search();
        }}
        onChange={(e) => setValue(e.target.value)}
        minLength={4}
        maxLength={50}
        type="search"
        className="font-inter md:mb-3 rounded-full peer h-[48px] w-full bg-neutral-700/20 focus:outline-none pl-6 pr-14 text-[14px] placeholder:text-neutral-400 text-neutral-300"
        placeholder={"Search " + props.text}
      ></input>
    </div>
  );
}
