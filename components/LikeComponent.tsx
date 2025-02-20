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
  let locallikedlist:any;
  let locallikes:any;
 let localuserlist:any;
  async function setLiked(like: boolean) {
     
    const {data:d,error:e}  = await supabase.from('posts').select('*').eq('id',props.postid);

    if(!e && d ){
      localuserlist = ulikedlist
      locallikedlist = d[0]["liked"]
    locallikes = d[0]["likes"]
      
    
    }
  
  
    if (like == false) {
      // let l = likedlist;
      setDisabled(true);
      const ss = locallikes;

      setLikes(locallikes - 1);

      // l = l.filter(function (item) {
      //   return item !== props.handle;
      // });
      let u = localuserlist;

      u = u.filter(function (item: any) {
        return item !== props.postid.toString();
      });

      const { error } = await supabase
        .from("posts")
        .update({ liked: u, likes: ss - 1 })
        .eq("id", props.postid);
      const { error: e } = await supabase.from("user").update({ liked: u }).eq("handle", props.handle);
      if (e || error) {
        alert(e?.message);

        alert(error?.message);
        setLikes(locallikes + 1);
      } else {
        toggleLiked(false);

        const { data } = await supabase.from("posts").select("liked").eq("id", props.postid);
        if (data) {
          setLikedList(data[0]["liked"]);
          const { data: d } = await supabase.from("user").select("liked").eq("handle", props.handle);
          if (d) {
            setuLikedList(d[0]["liked"]);
            setDisabled(false);
          }
        }
      }
    } else {
      const l = locallikedlist;
      setDisabled(true);
      const ss = locallikes;
      setLikes(locallikes + 1);

      l.push(props.handle);
      const u = localuserlist;
      u.push(props.postid);
      console.log(l);
      const { error: e } = await supabase.from("user").update({ liked: u }).eq("handle", props.handle);
      const { error } = await supabase
        .from("posts")
        .update({ liked: l, likes: ss + 1 })
        .eq("id", props.postid);

      if (error || e) {
        alert(error!.message);
        setLikes(locallikes - 1);

        alert(e!.message);
      } else {
        const { data } = await supabase.from("posts").select("liked").eq("id", props.postid);
        if (data) {
          setLikedList(data[0]["liked"]);
          const { data: d } = await supabase.from("user").select("liked").eq("handle", props.handle);
          if (d) {
            setuLikedList(d[0]["liked"]);
          }
          setDisabled(false);
          toggleLiked(true);
        }
      }
    }
  }
  return (
    <div className="flex text-white flex-row content-center items-center  space-x-[8px]  px-6">
      <svg
        onClick={() => (!disabled ? (toggleLiked(!liked), setLiked(!liked)) : console.log("holdup"))}
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
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

      <h1 className="text-xs md:text-sm">{likes} Likes</h1>
    </div>
  );
}
