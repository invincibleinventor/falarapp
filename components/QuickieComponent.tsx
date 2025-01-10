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
    console.log("text", text);
    const content = text.split(/((?:#|@|https?:\/\/[^\s]+)[a-zA-Z]+)/);
    let hashtag;
    const regex = /^[a-zA-Z]+$/;

    let username;
    return content.map((word) => {
      if (word.startsWith("#") && regex.test(word.slice(1, word.length - 1))) {
        hashtag = word.replace("#", "");
        return (
          <Link legacyBehavior href={`/hashtag/${hashtag}`}>
            <a className="text-cyan-800 hover:text-cyan-900">{word}</a>
          </Link>
        );
      } else if (word.startsWith("@")) {
        username = word.replace("@", "");
        return (
          <Link legacyBehavior href={`/profile/${username}`}>
            <a className="text-cyan-800 hover:text-cyan-900">{word}</a>
          </Link>
        );
      } else if (word.includes("http")) {
        return (
          <a target="_blank" href={word} className="text-cyan-800 hover:text-cyan-900">
            {word}
          </a>
        );
      } else {
        return word;
      }
    });
  };
  return (
    <div className="relative w-full animate-in">
      <div className="w-full ">
        <div className="flex flex-col px-2 py-2 border-b md:pr-2 lg:pr-2 border-b-neutral-900 md:py-0">
          <div className="flex items-center content-center bg-black rounded-md "></div>
          <div className="flex h-max flex-col gap-[8px] md:p-6 p-4 ">
            <div className="flex gap-2 mt-0">
              <Link href={"/profile/" + props.handle} className="flex  gap-[10px] mt-0">
               <UserInformation
                  image={imgdp}
                  id={props.userid}
                  imgclass="rounded-md object-cover min-w-[28px] max-w-[28px] h-7"
                />
                <div className="flex items-center content-center">
                  <h1>
                    <p className="text-base font-medium break-all text-neutral-300 line-clamp-1">{props.name}</p>
                  </h1>
                  <div className="mx-1 text-base text-neutral-500">·</div>
                  <span className="text-base font-medium text-neutral-500 whitespace-nowrap">@{props.handle}</span>
                </div>
              </Link>
              <Menu type="quickie" id={props.id} myhandle={props.myhandle} handle={props.handle} />
            </div>

            <div>
              <div
                onClick={() => router.push("/quickie/" + props.id)}
                style={{ wordBreak: "break-word", whiteSpace: "normal" }}
                className="cursor-pointer mt-[6px] pl-0 ml-0 text-[16px] font-normal  text-neutral-300 four-line-ellipsis md:text-[16px]"
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
                        className={`object-cover w-full border rounded-lg h-max ${props.image.length == 2 ? "aspect-[8/10]" : props.image.length == 4 ? "aspect-video" : "aspect-video"}`}
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
                  className="flex flex-row items-center content-center pl-6 space-x-2 text-neutral-400"
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

                <h1 className="text-[12px] font-medium text-neutral-500 capitalize ">{props.time}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
