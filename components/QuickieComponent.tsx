/* eslint-disable react/jsx-key */
"use client";
import Link from "next/link";
import BookMarksComponent from "./QuickieBookMarksComponent";
import LikeComponent from "./QuickieLikeComponent";
import { useEffect, useState } from "react";
import Menu from "./Menu";
import Image from "next/image";
import { useRouter } from "next/navigation";
import UserInformation from "./UserInformation";
export default function Post(props: any) {
  const [dialogopened, setDialogopened] = useState(false);
  const router = useRouter();
  const [imgdp, setimgdp] = useState(props.dp);

  useEffect(() => {
    setimgdp(imgdp + "?" + new Date().getTime());
  }, []);
  const timeStamp = new Date().getTime();
  let x = props.name;
  if (x.length >= 11) {
    x = x.slice(0, 7);
    x += "...";
  }
  let photocount;
  if (props.image) {
    photocount = props.image.length;
  }
  const formatText = (text: string) => {
    // Split by spaces and mentions/hashtags/URLs as separate tokens
    const tokens = text.split(/(\s+|(?:#|@)[a-zA-Z][\w]*|https?:\/\/[^\s]+)/);
  
    return tokens.map((token, idx) => {
      if (!token || token.trim() === '') {
        // Preserve whitespace as is
        return token;
      }
  
      // Hashtag: starts with # and next char is a letter
      if (/^#[a-zA-Z][\w]*$/.test(token)) {
        const hashtag = token.slice(1);
        return (
          <Link legacyBehavior href={`/hashtag/${hashtag}`} key={idx}>
            <a className="text-primary-600 hover:text-primary-700">{token}</a>
          </Link>
        );
      }
  
      // Mention: starts with @ and next char is a letter
      if (/^@[a-zA-Z][\w]*$/.test(token)) {
        const username = token.slice(1);
        return (
          <Link legacyBehavior href={`/profile/${username}`} key={idx}>
            <a className="text-primary-600 hover:text-primary-700">{token}</a>
          </Link>
        );
      }
  
      // URL
      if (/^https?:\/\/[^\s]+$/.test(token)) {
        return (
          <a target="_blank" href={token} className="text-primary-600 hover:text-primary-700" key={idx} rel="noreferrer">
            {token}
          </a>
        );
      }
  
      // Plain text or ignored patterns (like #7worlds or @3chan)
      return token;
    });
  };
  return (
    <div className="relative w-full animate-in">
      <div className="w-full">
        <div className="flex flex-col px-2 py-2 border-b md:pr-2 lg:pr-2 border-b-neutral-900 md:py-0">
          {props.parentid>0 &&
(        <Link
              href={`/quickie/${props.parentid}`}
              className="flex flex-row content-center items-center px-4 mt-4 space-x-4 text-sm text-primary-600"
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M19.5 6.25a.75.75 0 0 1 .75.75c0 2.244-.952 3.72-2.187 4.609c-1.196.861-2.61 1.141-3.563 1.141H6.31l3.72 3.72a.75.75 0 1 1-1.06 1.06l-5-5a.75.75 0 0 1 0-1.06l5-5a.75.75 0 1 1 1.06 1.06l-3.72 3.72h8.19c.713 0 1.8-.22 2.687-.859c.848-.61 1.563-1.635 1.563-3.391a.75.75 0 0 1 .75-.75"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="block">
              Replying to @{props.parentname}
              </span>
            </Link>
)}
          <div className="flex content-center items-center bg-black rounded-md"></div>
          <div className="flex h-max flex-col gap-[8px] md:p-6 p-4 ">
            <div className="flex gap-2 mt-0">
              <Link href={"/profile/" + props.handle} className="flex  gap-[10px] mt-0">
               <UserInformation
                  image={imgdp}
                  id={props.userid}
                  imgclass="rounded-md object-cover min-w-[28px] max-w-[28px] h-7"
                />
                <div className="flex content-center items-center">
                  <h1>
                    <p className="text-base font-medium break-all text-neutral-300 line-clamp-1">{props.name}</p>
                  </h1>
                  <div className="mx-1 text-base text-neutral-400">·</div>
                  <span className="text-base font-medium whitespace-nowrap text-neutral-400">@{props.handle}</span>
                </div>
              </Link>
              <Menu type="quickie" id={props.id} myhandle={props.myhandle} handle={props.handle} />
            </div>

            <div>
              <div
                onClick={() => router.push("/quickie/" + props.id)}
                style={{ wordBreak: "break-word", whiteSpace: "normal" }}
                className="cursor-pointer mt-[6px] pl-0 ml-0 text-[16px] font-medium  text-neutral-300 four-line-ellipsis md:text-[16px]"
              >
                {formatText(props.description)}

                {photocount > 0 && (
                  <div
                    className={
                      photocount == 1
                        ? "w-full border ml-0 rounded-md mt-4 aspect-video h-full mb-4"
                        : photocount == 3
                          ? "mt-4 mb-4 md:gap-2 gap-1 grid thrip"
                          : "mt-4 mb-4 md:gap-2 gap-1 grid-cols-2 grid"
                    }
                  >
                    {props.image.map((image: string) => (
                      <img
                        key={image}
                        className={`object-cover w-full border border-neutral-800 rounded-xl h-max ${props.image.length == 2 ? "aspect-[8/10]" : props.image.length == 4 ? "aspect-video" : "aspect-video"}`}
                        src={image}
                      ></img>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex px-[2px] flex-row items-center content-center mt-4">
                <LikeComponent
                  userliked={props.userliked}
                  postid={props.id}
                  handle={props.myhandle}
                  likedlist={props.likedlist}
                  liked={props.liked}
                  likes={props.likedlist.length}
                />

               
                <Link
                  href={"/quickie/" + props.id+"#comments"}
                  className="flex flex-row content-center items-center pl-6 space-x-2 text-white"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M5 3h13a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-4.59l-3.7 3.71c-.18.18-.43.29-.71.29a1 1 0 0 1-1-1v-3H5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3m13 1H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h4v4l4-4h5a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2"/></svg>{" "}
                  <h1 className="text-sm">{props.comments} <span className="hidden md:inline-block"></span></h1>
                </Link>
                <BookMarksComponent
                  userliked={props.userbookmarked}
                  postid={props.id}
                  handle={props.myhandle}
                  likedlist={props.bookmarkedlist}
                  liked={props.bookmarked}
                  likes={props.bookmarkedlist.length}
                />
                <span className="ml-auto"></span>

                <h1 className="text-[12px] font-medium text-neutral-400 capitalize ">{props.time}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
