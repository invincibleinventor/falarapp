/* eslint-disable react/jsx-key */
"use client";

import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Menu from "./Menu";
import UserInformation from "./UserInformation";
export default function CommentComponent(props: any) {
  const supabase = createClient();
  const [liked, toggleLiked] = useState(props.likedbyme);
  const [likes, setLikes] = useState(props.likes);
  const [likedbypeople, setLikedbypeople] = useState(props.likedbypeople);
  let locallikes: any;
  let locallikedlist: any;
  const [disabled, setDisabled] = useState(false);
  async function setLiked(like: boolean) {
    const { data, error } = await supabase.from("comments").select("*").eq("comment_id", props.comment_id);

    if (data) {
      locallikes = data[0]["likes"];
      locallikedlist = data[0]["liked"];
    } else {
      if (error) {
        alert(error.message);
      }
    }

    setDisabled(true);
    if (like == false) {
      let l = locallikedlist;
      l = l.filter(function (item: any) {
        return item !== props.myhandle;
      });
      const { error } = await supabase
        .from("comments")
        .update({ liked: l, likes: locallikes - 1 })
        .eq("comment_id", props.comment_id);
      if (error) {
        alert(error.message);
      } else {
        setLikes(locallikes - 1);
        toggleLiked(false);
        setDisabled(false);
      }
    } else {
      const l = locallikedlist;

      l.push(props.myhandle);
      const { error } = await supabase
        .from("comments")
        .update({ liked: l, likes: locallikes + 1 })
        .eq("comment_id", props.comment_id);

      if (error) {
        alert(error.message);
      } else {
        setLikes(locallikes + 1);
        toggleLiked(true);
        setDisabled(false);
      }
    }
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
    <div id={props.id} className="flex flex-row gap-4 px-6 pt-4 pb-2 my-0 w-full border-y border-y-neutral-800">
      <div className="flex w-full flex-col gap-[4px]">
        <div className="flex flex-row justify-between content-center items-center">
          <Link href={"/profile/" + props.handle} className="flex gap-2 mt-0">
            <UserInformation
              image={props.profile}
              id={props.userid}
              imgclass="rounded-none object-cover min-w-[24px] max-w-[24px] h-6"
            />
            <div className="flex content-center items-center ml-2 w-full">
              <h1>
                <p className="text-sm font-semibold text-neutral-300">{props.name}</p>
              </h1>
              <div className="mx-1 text-sm text-neutral-400"></div>
              <span className="text-sm font-medium whitespace-nowrap text-neutral-400">@{props.handle}</span>
              <div className="mx-[6px] text-sm text-neutral-400">·</div>

              <span className="ml-auto text-xs font-normal whitespace-nowrap text-neutral-400">{props.time}</span>
            </div>
          </Link>
          <Menu
            type="comment"
            alt="comments"
            id={props.comment_id}
            postid={props.postid}
            myhandle={props.myhandle}
            handle={props.handle}
          />
        </div>

        <h1 className="mt-[2px] mb-2 ml-10 text-[15px] font-normal text-neutral-300/90">{formatText(props.content)}</h1>
        <div className="flex flex-row content-center items-center pb-4 w-full">
          <div className=" w-full   flex flex-row content-center items-center space-x-[8px]">
            {props.loggedin && (
              <svg
                onClick={() => (!disabled ? (toggleLiked(!liked), setLiked(!liked)) : null)}
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                className="ml-auto text-neutral-300"
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
            <h1 className="text-xs font-medium text-neutral-300">{likes} Likes</h1>
            <div
              onClick={() => props.stateChanger("@" + props.handle + " ")}
              className="flex flex-row content-center items-center pl-2 space-x-2 text-xs font-medium cursor-pointer text-neutral-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M19.5 6.25a.75.75 0 0 1 .75.75c0 2.244-.952 3.72-2.187 4.609c-1.196.861-2.61 1.141-3.563 1.141H6.31l3.72 3.72a.75.75 0 1 1-1.06 1.06l-5-5a.75.75 0 0 1 0-1.06l5-5a.75.75 0 1 1 1.06 1.06l-3.72 3.72h8.19c.713 0 1.8-.22 2.687-.859c.848-.61 1.563-1.635 1.563-3.391a.75.75 0 0 1 .75-.75"
                  clipRule="evenodd"
                ></path>
              </svg>
              <h1> Reply</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
