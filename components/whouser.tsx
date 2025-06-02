"use client";

import notification from "@/utils/notifications/notification";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import UserInformation from "./UserInformation";
import { useEffect, useState } from "react";

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
  const myuserid = props.myid;
  const supabase = createClient();
  const handle = props.handle;
  const hisid = props.hisid;
  const [notifications, setNotifications] = useState(props.notifications);

  /*useEffect(()=>{
    async function getData(){
    const {data,error} = await supabase.from('user').select('followers').eq('id',hisid);
    if(data){
      if(data[0]["followers"].includes(myhandle)){
        setImFollowing(true);
      }
    }
    else{
      if(error){
        alert(error.message)
      }
    }
  }
  },[])*/
  const [imfollowing,setImFollowing] = useState<any>(false);
  async function onfollow(handle: any) {
    let localfollowerlist,localfollowinglist;
    const {data:his} = await supabase.from('user').select('*').eq('handle',handle);
    const {data:mine} = await supabase.from('user').select('*').eq('handle',myhandle);
    if(his && mine){
      localfollowerlist = his[0]["followers"];
      localfollowinglist = mine[0]["following"];
    }
    if (imfollowing) {
      let arr = localfollowerlist;
      arr = arr.filter((item: any) => item !== myhandle);
      let arr2 = localfollowinglist;
      arr2 = arr2.filter((item: any) => item !== handle);

      const { data, error } = await supabase.from("user").update({ followers: arr }).eq("handle", handle).select();
      const { data: d, error: e } = await supabase.from("user").update({ following: arr2 }).eq("handle", myhandle).select();
      
      if (!error && !e) {
     
        setImFollowing(false);
      }
    } else {
      const arr = localfollowerlist;
      arr.push(myhandle);
      const arr2 = localfollowinglist;
      arr2.push(handle);
      const { data, error } = await supabase.from("user").update({ followers: arr }).eq("handle", handle).select();
      const { data: d, error: e } = await supabase.from("user").update({ following: arr2 }).eq("handle", myhandle).select();

      if (!error && !e) {
        notification(
          notifications,
          supabase,
          props.hisid,
          "/profile/" + myhandle,
          "New Follower",
          "follow",
          myuserid,
          "@" + myhandle + " has followed you! Follow them back?",
          props.myImage
        );
        setImFollowing(true);
        
      }
    }
    return imfollowing;
  }
  return (
    <div className="flex flex-row justify-between content-center items-center text-sm font-medium text-white">
      <Link href={"/profile/" + props.handle} className="flex flex-row gap-3 content-center items-center">
        <UserInformation imfollowing={imfollowing}
                    {...props}

            onfollow={onfollow} id={hisid} imgclass="flex-shrink-0 w-6 h-6 rounded-md shrink-0" image={props.profile} />
        <h1 className="text-sm font-medium text-white">{modify(props.name)}</h1>
      </Link>
      <button
        onClick={() => onfollow(props.handle)}
        className={!imfollowing?"px-4 font-medium text-white rounded-full py-[2px] font-pops text-[12px] bg-primary-700":"px-4 font-medium text-black bg-white rounded-full py-[2px] font-poppins text-[12px]"}
      >
       {imfollowing?'Unfollow':'Follow'}
      </button>
    </div>
  );
}
