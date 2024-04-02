/* eslint-disable react/jsx-key */
"use client";

import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
export default function CommentComponent(props:any) {
  const supabase = createClient();
  const [liked, toggleLiked] = useState(props.likedbyme);
  const [likes, setLikes] = useState(props.likes);
  const [disabled, setDisabled] = useState(false);
  async function setLiked(like: boolean) {
    setDisabled(true);
    if (like == false) {
      let l = props.likedbypeople;
      console.log(l);
      l = l.filter(function (item:any) {
        return item !== props.myhandle;
      });
      console.log(l);
      const { error } = await supabase
        .from("comments")
        .update({ liked: l, likes: likes - 1 })
        .eq("comment_id", props.comment_id);
      if (error) {
        alert(error.message);
      } else {
        setLikes(likes - 1);
        toggleLiked(false);
        setDisabled(false);
      }
    } else {
      const l = props.likedbypeople;

      l.push(props.myhandle);
      console.log(l);
      const { error } = await supabase
        .from("comments")
        .update({ liked: l, likes: likes + 1 })
        .eq("comment_id", props.comment_id);

      if (error) {
        alert(error.message);
      } else {
        setLikes(likes + 1);
        toggleLiked(true);
        setDisabled(false);
      }
    }
  }

  const formatText = (text:string) => {
    console.log("text", text)
    const content = text.split(/((?:#|@|https?:\/\/[^\s]+)[a-zA-Z]+)/);
    let hashtag;
    let username;
    return content.map((word) => {
        if (word.startsWith("#")) {
            hashtag = word.replace('#', '')
            return <Link legacyBehavior href={`/hashtag/${hashtag}`}><a
                className="text-blue-500 hover:text-blue-600">{word}</a></Link>;
        } else if (word.startsWith("@")) {
            username = word.replace('@', '')
            return <Link legacyBehavior href={`/profile/${username}`}><a
                className="text-blue-500 hover:text-blue-600">{word}</a></Link>;
        } else if (word.includes("http")) {
            return <a target="_blank" href={word} className="text-blue-500 hover:text-blue-600">{word}</a>
        } else {
            return word;
        }
    });
  }
  return (
    <div className="flex flex-row w-full gap-4 my-2">
      <Link href={`/profile/${props.handle}`} className="w-10 h-10 shrink-0">
        <Image
          width={32}
          height={32}
          className="w-8 h-8 m-auto rounded-md shrink-0"
          src={props.profile!}
          alt="profile"
        />
      </Link>
      <div className="flex w-full flex-col gap-[2px]">
        <div className="flex flex-row items-center content-center w-full">
          <Link href={`/profile/${props.handle}`} className="text-[14px] font-semibold text-gray-300">
            {props.name}
          </Link>
          <h1 className="ml-auto text-xs font-normal text-gray-400">{props.time}</h1>
        </div>
        <h1 className="mt-[2px] text-[14px] font-normal text-gray-400">{formatText(props.content)}</h1>
        <div className="my-1 ml-auto mt-2 flex flex-row content-center items-center space-x-[8px]">
          {props.loggedin && (
            <svg
              onClick={() => (!disabled ? (toggleLiked(!liked), setLiked(!liked)) : console.log("hold up!"))}
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              className="text-gray-300"
              viewBox="0 0 48 48"
            >
              {liked ? (
                <path
                  fill="currentColor"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="4"
                  d="M15 8C8.925 8 4 12.925 4 19c0 11 13 21 20 23.326C31 40 44 30 44 19c0-6.075-4.925-11-11-11c-3.72 0-7.01 1.847-9 4.674A10.987 10.987 0 0 0 15 8"
                />
              ) : (
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="4"
                  d="M15 8C8.925 8 4 12.925 4 19c0 11 13 21 20 23.326C31 40 44 30 44 19c0-6.075-4.925-11-11-11c-3.72 0-7.01 1.847-9 4.674A10.987 10.987 0 0 0 15 8"
                />
              )}
            </svg>
          )}
          <h1 className="text-xs text-gray-400 ">{likes} Likes</h1>
        </div>
      </div>
    </div>
  );
}
