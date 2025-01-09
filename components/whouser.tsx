"use client";

import notification from "@/utils/notifications/notification";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function Whouser(props: any) {
  function modify(value: any) {
    let x = value;
    if (x.length >= 11) {
      x = x.slice(0, 7);
      x += "...";
      return x;
    } else {
      return x;
    }
  }
  const myhandle = props.myhandle;
  const myid = props.myid;
  const supabase = createClient();
  const handle = props.handle;
  const hisid = props.hisid;
  const followinglist = props.followinglist;
  const followerlist = props.followerlist;
  async function follow() {
    const arr: any = followerlist;
    arr.push(myhandle);

    let arr2 = followinglist;
    arr2.push(handle);
    arr2 = arr2.filter((item: string) => item !== myhandle);

    console.log(arr);
    const { data, error } = await supabase.from("user").update({ followers: arr }).eq("handle", handle);

    const { data: d, error: e } = await supabase.from("user").update({ following: arr2 }).eq("id", myid);

    if (error || e) {
      console.log(error?.message);
      console.log(e?.message);
    } else {
      notification(
        0,
        supabase,
        hisid,
        "/profile/" + myhandle,
        "New Follower",
        "follow",
        "@" + myhandle + " has followed you! Follow them back?",
        props.myImage
      );
      console.log(data);
      window.location.replace("/profile/" + handle);
    }
  }
  return (
    <div className="flex flex-row items-center content-center justify-between text-sm font-medium text-white">
      <Link href={"/profile/" + props.handle} className="flex flex-row items-center content-center gap-3">
        <img className="flex-shrink-0 w-6 h-6 rounded-md shrink-0" src={props.profile} />
        <h1 className="text-sm font-medium text-white">{modify(props.name)}</h1>
      </Link>
      <button
        onClick={() => follow()}
        className="px-4 py-[2px] font-poppins text-[12px] font-medium text-white rounded-full bg-cyan-800"
      >
        Follow
      </button>
    </div>
  );
}
