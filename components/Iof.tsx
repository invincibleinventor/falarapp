"use client";
export default function Iof(props: any) {
  return (
    <img
      onClick={() => window.open(props.src, "_blank")?.focus()}
      className={`object-cover w-full border border-neutral-800 rounded-xl h-max ${props.length == 2 ? "aspect-[8/10]" : props.length == 4 ? "aspect-video" : "aspect-video"}`}
      src={props.src}
    ></img>
  );
}
