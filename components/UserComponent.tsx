"use client";

import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function UserComponent(props:any) {
  const supabase = createClient();

  const [myId] = useState(props.myID);

  async function onfollow(handle:any) {
    if (imfollowing) {
      console.log("uesuesues");
      let arr = followerlist;
      console.log("before");
      console.log(arr);
      arr = arr.filter((item:any) => item !== myId);
      let arr2 = followinglist;
      arr2 = arr2.filter((item:any) => item !== handle);

      console.log(arr);
      const { data, error } = await supabase.from("user").update({ followers: arr }).eq("handle", handle).select();
      const { data:d, error:e } = await supabase.from("user").update({ following: arr2 }).eq("handle", myId).select();
      // const { data: me, error: mee } = await supabase
      //   .from("user")
      //   .update({ following: arr2 })
      //   .eq("handle", myId)
      //   .select();
      if (error || e) {
        console.log(error);
      } else {
        console.log(data);
      }
      setFollowerList(arr);
      setFollowingList(arr2);
      setImFollowing(false);
    } else {
      const arr = followerlist;
      arr.push(myId);
      const arr2 = followinglist;
      arr2.push(handle);
      console.log(arr);
      const { data, error } = await supabase.from("user").update({ followers: arr }).eq("handle", handle).select();
      const { data:d, error:e } = await supabase.from("user").update({ following: arr2 }).eq("handle", myId).select();

      // const { data: me, error: mee } = await supabase
      //   .from("user")
      //   .update({ following: arr2 })
      //   .eq("handle", myId)
      //   .select();
      if (error || e) {
        console.log(error);
      } else {
        console.log(data);
      }
      setImFollowing(true);
      setFollowerList(arr);
      setFollowingList(arr2);
    }
  }
  const [imfollowing, setImFollowing] = useState(props.isfollowing);
  const [followerlist, setFollowerList] = useState(props.followerlist);
  const [followinglist, setFollowingList] = useState(props.followinglist);
  let a = props.name;
  if (a.length >= 11) {
    a = a.slice(0, 7);
    a += "...";
  }
  return (
    <Link
      href={"/profile/" + props.handle}
      className="mx-auto my-2 flex md:h-[270.29px] w-[calc(303.86px)] rounded-md   flex-col  md:pb-4 pb-5 p-4 xl:mx-2 xl:w-auto"
    >
      <div className="flex flex-row items-center content-center justify-between">
        <div className="flex flex-row items-center content-center space-x-3">
          <Image width={40} height={40} src={props.image} className="object-cover w-10 h-10 rounded-full" alt="profile-pic" />
          <div className="flex flex-col ">
            <h1 className="text-base font-bold text-gray-300">{a}</h1>
            <h1 className="text-xs font-normal text-gray-500">@{props.handle}</h1>
          </div>
        </div>
        <button
          onClick={(e) => (e.stopPropagation(), e.preventDefault(), onfollow(props.handle))}
          className={
            imfollowing
              ? "h-max border border-black bg-white px-4 py-1 text-xs  rounded-full text-black"
              : "h-max border border-black bg-cyan-800 px-4 py-1 text-xs rounded-full text-white"
          }
        >
          {imfollowing ? "Unfollow" : "Follow"}
        </button>
      </div>
      <div className="flex flex-row items-center content-center gap-6 p-4 mx-0 my-6 mb-4 border rounded-md bg-gray-900/40 ">
        <div className="flex flex-row w-full md:mx-auto">
          <div className="flex flex-col items-center content-center gap-1 mx-auto w-max">
            <h1 className="text-xs font-semibold text-gray-300">Followers</h1>
            <h1 className="text-sm font-medium text-gray-500">{props.followers} Followers</h1>
          </div>
          <div className="flex flex-col items-center content-center gap-1 mx-auto w-max">
            <h1 className="text-xs font-semibold text-gray-300">Following</h1>
            <h1 className="text-sm font-medium text-gray-500">{props.following} Following</h1>
          </div>
        </div>
      </div>
      <div className="mt-0 w-full px-[2px]">
        <h1 className="text-sm text-gray-400 fix-overflow four-line-ellipsis">{props.about}</h1>
      </div>
    </Link>
  );
}
