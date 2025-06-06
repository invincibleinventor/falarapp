"use client";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

export default function LikeComponent(props: any) {
  const supabase = createClient();
  const [likedlist, setLikedList] = useState(props.likedlist);
  const [liked, toggleLiked] = useState(props.liked);
  const [ulikedlist, setuLikedList] = useState(props.userliked);
  const [disabled, setDisabled] = useState(false);
  const [likes, setLikes] = useState(props.likes);
  let locallikedlist: any;
  let locallikes: any;
  let localuserlist: any;
  async function setLiked(like: boolean) {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      setDisabled(true);
      return;
    }
    toggleLiked(!liked);
    const { data: d, error: e } = await supabase.from("quickies").select("*").eq("id", props.postid);

    if (!e && d) {
      locallikedlist = d[0]["liked"];
      locallikes = d[0]["likes"];
      localuserlist = ulikedlist;
    }

    if (like == false) {
      let l = locallikedlist;
      setDisabled(true);

      l = l.filter(function (item: any) {
        return item !== props.handle;
      });
      let u = localuserlist;
      const x = locallikes;
      setLikes(locallikes - 1);
      u = u.filter(function (item: any) {
        return item !== props.postid.toString();
      });

      const { error } = await supabase
        .from("quickies")
        .update({ liked: l, likes: x - 1 })
        .eq("id", props.postid);
      const { error: e } = await supabase.from("user").update({ quickieliked: u }).eq("handle", props.handle);
      if (e || error) {
        alert(e!.message);
        alert(error!.message);
        setLikes(locallikes + 1);
      } else {
        toggleLiked(false);

        const { data } = await supabase.from("quickies").select("liked").eq("id", props.postid);
        if (data) {
          setLikedList(data[0]["liked"]);
          const { data: d } = await supabase.from("user").select("quickieliked").eq("handle", props.handle);
          if (d) {
            setuLikedList(d[0]["quickieliked"]);
            setDisabled(false);
          }
        }
      }
    } else {
      const l = locallikedlist;
      setDisabled(true);
      const x = locallikes;
      l.push(props.handle);
      const u = localuserlist;
      setLikes(locallikes + 1);
      u.push(props.postid);
      const { error: e } = await supabase.from("user").update({ quickieliked: u }).eq("handle", props.handle);
      const { error } = await supabase
        .from("quickies")
        .update({ liked: l, likes: x + 1 })
        .eq("id", props.postid);

      if (error || e) {
        alert(error!.message);
        alert(e!.message);
        setLikes(locallikes - 1);
      } else {
        const { data } = await supabase.from("quickies").select("liked").eq("id", props.postid);
        if (data) {
          setLikedList(data[0]["liked"]);
          const { data: d } = await supabase.from("user").select("quickieliked").eq("handle", props.handle);
          if (d) {
            setuLikedList(d[0]["quickieliked"]);
          }
          setDisabled(false);

          toggleLiked(true);
        }
      }
    }
  }
  return (
    <div className="flex cursor-pointer text-white flex-row content-center items-center  space-x-[8px]  ">
      <svg
        onClick={() => (!disabled ? setLiked(!liked) : null)}
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 48 48"
      >
        {liked ? (
          <path
            className="fill-primary-600 stroke-primary-600"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 8C8.925 8 4 12.925 4 19c0 11 13 21 20 23.326C31 40 44 30 44 19c0-6.075-4.925-11-11-11c-3.72 0-7.01 1.847-9 4.674A10.987 10.987 0 0 0 15 8"
          />
        ) : (
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 8C8.925 8 4 12.925 4 19c0 11 13 21 20 23.326C31 40 44 30 44 19c0-6.075-4.925-11-11-11c-3.72 0-7.01 1.847-9 4.674A10.987 10.987 0 0 0 15 8"
          />
        )}
      </svg>

      <h1 className="text-sm">{likes}</h1>
    </div>
  );
}
