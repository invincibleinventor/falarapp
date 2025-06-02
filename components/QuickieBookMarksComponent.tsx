"use client";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

export default function BookMarksComponent(props: any) {
  const supabase = createClient();
  const [likedlist, setLikedList] = useState(props.likedlist);

  const [liked, toggleLiked] = useState(props.liked);
  const [ulikedlist, setuLikedList] = useState(props.userliked);
  const [disabled, setDisabled] = useState(false);
  let locallikedlist:any;
  
let localuserlist:any;
  const [likes, setLikes] = useState(props.likes);
  async function setLiked(like: boolean) {
   const {data} = await supabase.auth.getUser();
   if(!data.user){
    setDisabled(true);
      return;
   }
   toggleLiked(!liked)
    const {data:d,error:e}  = await supabase.from('quickies').select('*').eq('id',props.postid);
    if(!e && d ){
  locallikedlist = d[0]["bookmarked"];
  
      localuserlist = ulikedlist
    }
     
    if (like == false) {
      let l = locallikedlist;
      setLikes(likes - 1);

      console.log(l);
      setDisabled(true);

      l = l.filter(function (item: any) {
        return item !== props.handle;
      });
      let u = localuserlist;
console.log(props.postid)
      u = u.filter(function (item: any) {
        return item !== props.postid.toString();
      });
      console.log('inga')
      console.log(u)
      console.log(l);
      const { error: e } = await supabase.from("user").update({ quickiebookmarks: u }).eq("handle", props.handle);

      const { error } = await supabase.from("quickies").update({ bookmarked: l }).eq("id", props.postid);
      if (error || e) {
        setLikes(likes + 1);

        alert(error!.message);
        alert(e!.message);
      } else {
        const { data } = await supabase.from("quickies").select("bookmarked").eq("id", props.postid);
        if (data) {
          setLikedList(data[0]["bookmarked"]);
          toggleLiked(false);
          const { data: d } = await supabase.from("user").select("quickiebookmarks").eq("handle", props.handle);
          if (d) setuLikedList(d[0]["quickiebookmarks"]);
          setDisabled(false);
        }
      }
    } else {
      const l = locallikedlist;
      setDisabled(true);
      setLikes(likes + 1);

      l.push(props.handle);
      const u = localuserlist;
      u.push(props.postid);
      console.log(l);
      const { error: e } = await supabase.from("user").update({ quickiebookmarks: u }).eq("handle", props.handle);

      const { error } = await supabase.from("quickies").update({ bookmarked: l }).eq("id", props.postid);

      if (error || e) {
        setLikes(likes - 1);
        alert(error!.message);
        alert(e!.message);
      } else {
        const { data } = await supabase.from("quickies").select("bookmarked").eq("id", props.postid);
        if (data) {
          setLikedList(data[0]["bookmarked"]);
          toggleLiked(true);
          setLikes(likes + 1);
          const { data: d } = await supabase.from("user").select("quickiebookmarks").eq("handle", props.handle);
          if (d) setuLikedList(d[0]["quickiebookmarks"]);
          setDisabled(false);
        }
      }
    }
  }
  return (
    <div
      onClick={() => (!disabled ? ( setLiked(!liked)) : console.log("holdup"))}
      className="flex flex-row content-center items-center px-4 text-white cursor-pointer"
    >


      
<svg width="17" height="17" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        {liked ? (
       <g className="text-primary-600" fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M4 5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v16.028c0 1.22-1.38 1.93-2.372 1.221L12 18.229l-5.628 4.02c-.993.71-2.372 0-2.372-1.22z"/></g>
        
        ):
     (<g fill="none" fill-rule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M4 5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v16.028c0 1.22-1.38 1.93-2.372 1.221L12 18.229l-5.628 4.02c-.993.71-2.372 0-2.372-1.22zm3-1a1 1 0 0 0-1 1v15.057l5.128-3.663a1.5 1.5 0 0 1 1.744 0L18 20.057V5a1 1 0 0 0-1-1z"/></g>)}
          </svg>
    </div>
  );
  
}


