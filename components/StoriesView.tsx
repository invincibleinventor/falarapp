"use client";
import Image from "next/image";
import { useState } from "react";
export default function StoriesView(props: any) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-row px-0 pt-0">
      <div
        onClick={() => setVisible(!visible)}
        style={{ background: `url('${props.image}')` }}
        className="relative w-24 h-32 rounded-md bg-gradient-to-b from-black to-current"
      >
        <h1 className="absolute text-xs font-medium text-white bottom-2 left-3">{props.name}</h1>
        <Image
          width={32}
          height={32}
          className="absolute w-8 h-8 bg-purple-500 border border-white rounded-full left-3 top-2"
          src={props.profile}
          alt="story"
        />
      </div>
    </div>
  );
}
