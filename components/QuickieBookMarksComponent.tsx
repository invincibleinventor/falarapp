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
      className="flex flex-row items-center content-center px-4 text-white cursor-pointer"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        {liked ? (
          <path fill="#1DA1F2" d="m12 16.923l-3.738 1.608q-.808.348-1.535-.134Q6 17.916 6 17.052V5.616q0-.691.463-1.153T7.616 4h8.769q.69 0 1.153.463T18 5.616v11.436q0 .864-.727 1.345q-.727.482-1.535.134zm0-1.123l4.135 1.784q.307.135.586-.057q.279-.193.279-.52V5.617q0-.231-.192-.424T16.384 5H7.616q-.231 0-.424.192T7 5.616v11.392q0 .327.279.519t.586.057zM12 5H7h10z"/>        ) : (
<path fill="currentColor" d="m12 16.923l-3.738 1.608q-.808.348-1.535-.134Q6 17.916 6 17.052V5.616q0-.691.463-1.153T7.616 4h8.769q.69 0 1.153.463T18 5.616v11.436q0 .864-.727 1.345q-.727.482-1.535.134zm0-1.123l4.135 1.784q.307.135.586-.057q.279-.193.279-.52V5.617q0-.231-.192-.424T16.384 5H7.616q-.231 0-.424.192T7 5.616v11.392q0 .327.279.519t.586.057zM12 5H7h10z"/>        )}
      </svg>
    </div>
  );
  
}


