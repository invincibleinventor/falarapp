/* eslint-disable react/jsx-key */
"use client";
import Link from "next/link";
import BookMarksComponent from "./QuickieBookMarksComponent";
import LikeComponent from "./QuickieLikeComponent";
import { useEffect, useState } from "react";
import Menu from "./Menu";
import Image from "next/image";
import { useRouter, redirect } from "next/navigation";
import UserInformation from "./UserInformation";
import Iof from "./Iof";
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
    const tokens = text.split(/(\s+|(?:#|@)[a-zA-Z][\w]*|https?:\/\/[^\s]+)/);

    return tokens.map((token, idx) => {
      if (!token || token.trim() === "") {
        return token;
      }

      if (/^#[a-zA-Z][\w]*$/.test(token)) {
        const hashtag = token.slice(1);
        return (
          <Link legacyBehavior href={`/hashtag/${hashtag}`} key={idx}>
            <a className="text-primary-300 hover:text-primary-300">{token}</a>
          </Link>
        );
      }

      if (/^@[a-zA-Z][\w]*$/.test(token)) {
        const username = token.slice(1);
        return (
          <Link legacyBehavior href={`/profile/${username}`} key={idx}>
            <a className="text-primary-300 hover:text-primary-300">{token}</a>
          </Link>
        );
      }

      if (/^https?:\/\/[^\s]+$/.test(token)) {
        return (
          <a
            target="_blank"
            href={token}
            className="text-primary-300 hover:text-primary-300"
            key={idx}
            rel="noreferrer"
          >
            {token}
          </a>
        );
      }

      return token;
    });
  };
  return (
    <div className="relative w-full animate-in">
      <div className="w-full">
        <div className="flex flex-col px-2 py-2 border-b md:pr-2 lg:pr-2 border-b-neutral-800 md:py-0">
          {props.parentid > 0 && (
            <Link
              href={`/quickie/${props.parentid}`}
              className="flex flex-row content-center items-center px-4 mt-4 space-x-4 text-sm text-primary-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M19.5 6.25a.75.75 0 0 1 .75.75c0 2.244-.952 3.72-2.187 4.609c-1.196.861-2.61 1.141-3.563 1.141H6.31l3.72 3.72a.75.75 0 1 1-1.06 1.06l-5-5a.75.75 0 0 1 0-1.06l5-5a.75.75 0 1 1 1.06 1.06l-3.72 3.72h8.19c.713 0 1.8-.22 2.687-.859c.848-.61 1.563-1.635 1.563-3.391a.75.75 0 0 1 .75-.75"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="block font-medium text-primary-500">Replying to @{props.parentname}</span>
            </Link>
          )}
          <div className="flex content-center items-center bg-black rounded-none"></div>
          <div className="flex h-max flex-col gap-[8px] md:p-6 p-4 pr-4">
            <div className="flex gap-2 mt-0">
              <Link href={"/profile/" + props.handle} className="flex  gap-[10px] mt-0">
                <UserInformation
                  image={imgdp}
                  id={props.userid}
                  imgclass="rounded-none object-cover min-w-[28px] max-w-[28px] h-7"
                />
                <div className="flex content-center items-center">
                  <h1>
                    <p className="text-base font-medium break-all text-neutral-300 line-clamp-1">{props.name}</p>
                  </h1>
                  <div className="mx-1 text-base text-neutral-400">·</div>
                  <span className="text-base font-medium whitespace-nowrap text-neutral-400">@{props.handle}</span>
                </div>
              </Link>
              {props.parentid && (
                <Menu
                  type="qreply"
                  quickieid={props.parentid}
                  id={props.id}
                  myhandle={props.myhandle}
                  handle={props.handle}
                />
              )}
              {props.loadedreply && (
                <Menu
                  type="qreply"
                  quickieid={props.pid}
                  id={props.id}
                  myhandle={props.myhandle}
                  handle={props.handle}
                />
              )}
              {!(props.parentid > 0) && !props.loadedreply && (
                <Menu type="quickie" id={props.id} myhandle={props.myhandle} handle={props.handle} />
              )}
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
                        ? "w-full border ml-0 rounded-none mt-4 aspect-video h-full mb-4"
                        : photocount == 3
                          ? "mt-4 mb-4 md:gap-2 gap-1 grid thrip"
                          : "mt-4 mb-4 md:gap-2 gap-1 grid-cols-2 grid"
                    }
                  >
                    {props.image.map((image: string) => (
                      <img
                        key={image}
                        className={`object-cover w-full border border-neutral-800 rounded-none h-max ${props.image.length == 2 ? "aspect-[8/10]" : props.image.length == 4 ? "aspect-video" : "aspect-video"}`}
                        src={image}
                      ></img>
                    ))}
                  </div>
                )}
              </div>
              {props.quote && (
                <div
                  onClick={() => redirect("/quickie/" + props.quoteid)}
                  className="flex h-max border pb-4 mb-6 cursor-pointer  border-neutral-800  bg-neutral-950/10 rounded-none mx-0  flex-col gap-[8px] pt-4 mt-4 "
                >
                  <div className="flex flex-row gap-2 content-center items-center h-max shrink-0">
                    <div className="flex gap-[10px] px-4 mt-0">
                      <Image
                        width={20}
                        height={20}
                        src={props.quotedisplay}
                        alt="user profile"
                        className="rounded-none object-cover min-w-[24px] max-w-[24px] h-6 max-h-6"
                      />
                      <div className="flex content-center items-center">
                        <h1>
                          <p className="text-sm font-medium break-all text-neutral-300 line-clamp-1">
                            {props.quotename}
                          </p>
                        </h1>
                        <div className="mx-1 text-sm text-neutral-400">·</div>
                        <span className="text-sm font-medium whitespace-nowrap text-neutral-400">
                          @{props.quotehandle}
                        </span>
                      </div>
                    </div>
                    <h1 className="px-4 ml-auto w-max text-xs font-medium text-neutral-400">{props.quotetime}</h1>
                  </div>

                  <div>
                    <h1
                      style={{ wordBreak: "break-word", whiteSpace: "normal" }}
                      className="px-4 mt-1 text-sm font-medium text-neutral-300 four-line-ellipsis md:text-base"
                    >
                      {formatText(props.quotecontent)}
                    </h1>

                    {props.quotephotocount > 0 && (
                      <div
                        className={
                          props.quotephotocount == 1
                            ? "w-full px-4 border ml-0 rounded-none mt-4 aspect-video h-full"
                            : props.quotephotocount == 3
                              ? "mt-4 px-4  md:gap-2 gap-1 grid thrip"
                              : "mt-4 px-4 md:gap-2 gap-1 grid-cols-2 grid"
                        }
                      >
                        {props.quoteimage.map((image: string) => (
                          <Iof key={image} length={props.quotephotocount} src={image} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

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
                  href={"/quickie/" + props.id + "#comments"}
                  className="flex flex-row content-center items-center pl-6 space-x-2 text-white"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fill="currentColor"
                      d="M5 3h13a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-4.59l-3.7 3.71c-.18.18-.43.29-.71.29a1 1 0 0 1-1-1v-3H5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3m13 1H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h4v4l4-4h5a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2"
                    />
                  </svg>{" "}
                  <h1 className="text-sm">
                    {props.comments} <span className="hidden md:inline-block"></span>
                  </h1>
                </Link>
                <Link
                  href={"/quote/" + props.id}
                  className="flex flex-row content-center items-center pr-5 pl-5 space-x-2 text-white"
                >
                  <svg width="22" height="22" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                    <g
                      fill="none"
                      fillRule="evenodd"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m13.5 13.5l3 3l3-3" />
                      <path d="M9.5 4.5h3a4 4 0 0 1 4 4v8m-9-9l-3-3l-3 3" />
                      <path d="M11.5 16.5h-3a4 4 0 0 1-4-4v-8" />
                    </g>
                  </svg>
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
