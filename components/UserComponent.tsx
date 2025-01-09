"use client";

import notification from "@/utils/notifications/notification";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import UserInformation from "./UserInformation";

export default function UserComponent(props: any) {
  const supabase = createClient();

  const [myId] = useState(props.myID);
  const [myuserid] = useState(props.userid);
  const [imfollowing, setImFollowing] = useState(props.isfollowing);
  const [followerlist, setFollowerList] = useState(props.followerlist);
  const [followinglist, setFollowingList] = useState(props.followinglist);
  const [notifications, setNotifications] = useState(props.notifications);

  async function onfollow(handle: any) {
    let localfollowerlist,localfollowinglist;
    const {data:his} = await supabase.from('user').select('*').eq('handle',handle);
    const {data:mine} = await supabase.from('user').select('*').eq('handle',props.myID);
    if(his && mine){
      localfollowerlist = his[0]["followers"];
      localfollowinglist = mine[0]["following"];
    }
    if (imfollowing) {
      let arr = localfollowerlist;
      arr = arr.filter((item: any) => item !== myId);
      let arr2 = localfollowinglist;
      arr2 = arr2.filter((item: any) => item !== handle);

      const { data, error } = await supabase.from("user").update({ followers: arr }).eq("handle", handle).select();
      const { data: d, error: e } = await supabase.from("user").update({ following: arr2 }).eq("handle", myId).select();
      
      if (!error && !e) {
        setFollowerList(arr);
        setFollowingList(arr2);
        setImFollowing(false);
      }
    } else {
      const arr = localfollowerlist;
      arr.push(myId);
      const arr2 = localfollowinglist;
      arr2.push(handle);
      const { data, error } = await supabase.from("user").update({ followers: arr }).eq("handle", handle).select();
      const { data: d, error: e } = await supabase.from("user").update({ following: arr2 }).eq("handle", myId).select();

      if (!error && !e) {
        notification(
          notifications,
          supabase,
          props.id,
          "/profile/" + myId,
          "New Follower",
          "follow",
          myuserid,
          "@" + myId + " has followed you! Follow them back?",
          props.myImage
        );
        setImFollowing(true);
        setFollowerList(arr);
        setFollowingList(arr2);
      }
    }
    return imfollowing;
  }

  let a = props.name;
  if (a.length >= 11) {
    a = a.slice(0, 7);
    a += "...";
  }

  return (
    <Link
      href={"/profile/" + props.handle}
      className="mx-auto my-2 flex md:h-[270.29px] w-[calc(303.86px)] rounded-md flex-col md:pb-4 pb-5 p-4 xl:mx-2 xl:w-auto"
    >
      <div className="flex flex-row items-center content-center justify-between">
        <div className="flex flex-row items-center content-center space-x-3">
          <UserInformation
            {...props}
            imfollowing={imfollowing}
            onfollow={onfollow}
            id={props.userid}
            image={props.image}
            imgclass="object-cover w-10 h-10 rounded-lg"
            alt="profile-pic"
          />
          <div className="flex flex-col">
            <h1 className="text-base font-bold text-gray-300">{a}</h1>
            <h1 className="text-xs font-normal text-gray-500">@{props.handle}</h1>
          </div>
        </div>
        <button
          onClick={(e) => (e.stopPropagation(), e.preventDefault(), onfollow(props.handle))}
          className={
            imfollowing
              ? "h-max border border-black bg-white px-4 py-1 text-xs rounded-full text-black"
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
