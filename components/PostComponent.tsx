"use client";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import UserInformation from "./UserInformation";
export default function Post(props: any) {
  let s = props.description;
  const timeStamp = new Date().getTime();
  let x = props.name;
  if (x.length >= 11) {
    x = x.slice(0, 4);
    x += "...";
  }
  const a = props.title;

  if (props.type == "profile") {
    if (s.length > 100) {
      s = s.slice(0, 100);
      s += "...";
    }
  } else {
    if (s.length > 147) {
      s = s.slice(0, 147);
      s += "...";
    }
  }
  return (
    <div className="w-full animate-in">
      <div className="w-full px-6 py-[6px] border-b border-neutral-900">
        <article className="px-2 py-6 pt-0 ">
          <Link href={"/profile/" + props.handle} className="flex gap-2 mt-4">
           <UserInformation id={props.userid} image={props.dp}
              imgclass="rounded-md object-cover min-w-[24px] max-w-[24px] h-6"
            />
            <div className="flex items-center content-center">
              <h1>
                <p className="text-sm font-medium break-all text-neutral-300 line-clamp-1">{props.name}</p>
              </h1>
              <div className="mx-1 text-sm text-neutral-500">·</div>
              <span className="text-sm font-medium text-neutral-500 whitespace-nowrap">{props.time}</span>
            </div>
          </Link>
          <div className="flex flex-col mt-3">
            <div className="flex grow">
              <div className="text-neutral-500 grow">
                <Link href={"/post/" + props.id} className="pb-2">
                  <h2 className="font-bold text-neutral-300 md:text-[22px] leading-7 md:line-clamp-3 line-clamp-2 text-base">
                    {a}{" "}
                  </h2>
                </Link>
                <p className="hidden my-2 mt-4 text-sm line-clamp-3 md:inline-block">{s} </p>
              </div>
              <div className="md:ml-[60px] ml-6">
                <h1 className="block md:w-[112px] md:h-[112px] w-[80px h-[56px]">
                  <div className="relative rounded-xl aspect-[4/4] min-h-[64px] min-w-[64px] max-w-full max-h-full shrink-0">
                  <Image
                    alt="cover"
                    width={0}
                    layout='fill'

                    height={0}
                    objectFit="cover"
                    src={props.cover + "?" + timeStamp}
                    className="object-cover rounded-xl aspect-[4/4] min-h-[64px] min-w-[64px] max-w-full max-h-full shrink-0"
                  />
                  </div>
                </h1>
              </div>
            </div>
            <div className="flex flex-row items-center mt-2 ">
              <div className="grow flex flex-row items-center text-[13px]">
                <h1 className="text-neutral-400 bg-subtle-white rounded-full hover:bg-neutral-200 transition-colors duration-300 px-0 pl-0 py-[2px] mr-2">
                  {props.likes} Likes
                </h1>
                <div className="inline-block pr-2 text-sm text-neutral-400">·</div>

                <h1>
                  <span className="text-neutral-400">@{props.handle}</span>
                </h1>
              </div>
              <button className="px-2 text-lg text-neutral-500 hover:text-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed">
                <i className="fa-regular fa-bookmark thin-icon"></i>
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
