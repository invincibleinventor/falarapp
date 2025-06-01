'use client'

import More from "@/components/MoreQuickies";
import PostComponent from "@/components/QuickieComponent";
import Search from "@/components/SearchComponent";
import Stories from "@/components/stories";
import Trending from "@/components/Trending";
import { AppConfig } from "@/config/config";
import { createClient } from "@/utils/supabase/client";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import Link from "next/link";
import { useEffect, useState } from "react";

TimeAgo.addLocale(en);

export default function Index() {
  const supabase = createClient();
  const timeAgo = new TimeAgo("en-US");
  const date1 = new Date();

  const [empty, setempty] = useState(true);
  const [posts, setposts] = useState<any[]>([]);
  const [loading, setloading] = useState(true);
  const [l, setl] = useState<any[]>([]);
  const [myname, setmyname] = useState("");
  const [myphoto, setmyphoto] = useState("");
  const [myhandle, setmyhandle] = useState("");
  const [userliked, setuserliked] = useState<any[]>([]);
  const [userbookmarked, setuserbookmarked] = useState<any[]>([]);
  const [myblocked, setmyblocked] = useState<any[]>([]);
  const [newblocked, setnewblocked] = useState<any[]>([]);

  useEffect(() => {
    async function get() {
      const { data: user } = await supabase.auth.getUser();
      const s = user.user!.id;

      const { data: u } = await supabase.from("user").select("*").eq("id", s);
      let tempL = u![0]["following"];
      const h = u![0]["handle"];
      setmyname(u![0]["name"]);
      setmyphoto(u![0]["image"]);
      setmyblocked(u![0]["blocked"]);
      setnewblocked(u![0]["blockedby"]);
      setmyhandle(u![0]["handle"]);
      setuserbookmarked(u![0]["quickiebookmarks"]);
      setuserliked(u![0]["quickieliked"]);
      tempL.push(h);
      setl(tempL);

      const { data, error } = await supabase
        .from("quickies")
        .select(
          `*, 
        user (
          name,
          id,
          handle,
          image
        )`
        )
        .order("id", { ascending: false })
        .in("handle", tempL)
        .not("poster", "in", `(${u![0]["blocked"].toString()})`)
        .not("poster", "in", `(${u![0]["blockedby"].toString()})`)
        .limit(5);

      if (error) {
        console.log(error);
      } else {
        const ds = data!;
        for await (const [index, post] of ds.entries()) {
          let liked = false;
          if(ds[index].to>0){
            const { data } = await supabase.from("quickies").select(`*, 
              user (
              
                handle
              
              )`).eq("id", post.to);
            ds[index].parentid = ds[index].to;

            if(data && data?.length>0){
              ds[index].parentname = data[0].user.handle;
            }
        
          }
          const likedlist: string | any[] = ds[index].liked;
          let bookmarked = false;
          const bookmarkedlist: any[] = ds[index].bookmarked;
          if (likedlist.includes(h)) {
            liked = true;
          }
          if (bookmarkedlist.includes(h)) {
            bookmarked = true;
          }
          ds[index].liked = liked;
          ds[index].bookmarked = bookmarked;
          ds[index].bookmarkedlist = bookmarkedlist;
          ds[index].likedlist = likedlist;
          const date2 = new Date(ds[index].created_at);
          ds[index].diff = date1.getTime() - date2.getTime();
        }

        setposts(ds);
        setempty(ds.length === 0);
        setloading(false);
      }
    }
    get();
  }, []);

  return (
    <>
      <div className="overflow-hidden flex-1 p-0 py-2 h-screen">


<div className="overflow-y-scroll py-2 h-full hiddenscroll">

<div className="flex flex-col gap-0 mb-20 animate-in hiddenscroll">
     
          <div className="parent-container">{/* <Stories></Stories> */}</div>
          <div className="lg:hidden">
            <Trending />
          </div>
          {!loading ? (
            !empty ? (
              posts.map((post) => (
                <PostComponent
                  id={post.id}
                  cover={post.cover}
                  title={post.title}
                  to={post.to}
                  time={timeAgo.format(Date.now() - post.diff)}
                  key={post.id}
                  image={post.image}
                  comments={post.comments}
                  userliked={userliked}
                  userid={post.user.id}
                  userbookmarked={userbookmarked}
                  bookmarkedlist={post.bookmarkedlist}
                  likedlist={post.likedlist}
                  myhandle={myhandle}
                  
                  dp={post.user.image}
                  bookmarked={post.bookmarked}
                  liked={post.liked}
                  handle={post.handle}
                  parentid={post.parentid}
                  parentname={post.parentname}
                  name={post.user.name}
                  description={post.content}
                />
              ))
            ) : (
              <div className="flex content-center items-center px-10 mt-24 w-full sm:px-24 md:px-16 lg:px-24">
                <div className="flex flex-col gap-2 mx-auto max-w-max">
                  <h1 className="mx-auto text-lg font-semibold text-center text-neutral-300">No Quickies To View!</h1>
                  <h1 className="mx-auto text-sm text-center text-neutral-400">
                    Follow people to view their quickies on your feed. The more people you follow, the more quickies
                    on your feed
                  </h1>
                  <Link
                    href="/explore"
                    className={`mx-auto mt-3 rounded-full w-max px-8 py-3 text-xs font-medium  ${
                      1 == 1 ? "bg-primary-800 text-white" : "border-2 bg-white"
                    }`}
                  >
                    Explore People
                  </Link>
                </div>
              </div>
            )
          ) : (
            <div className="flex content-center items-center w-full h-screen"></div>
          )}
          <More
            myblocked={myblocked}
            myhandle={myhandle}
            myname={myname}
            myphoto={myphoto}
            newblocked={newblocked}
            userliked={userliked}
            userbookmarked={userbookmarked}
            in={l}
          ></More>
        </div>
        </div>
        </div>
    </>
  );
}
