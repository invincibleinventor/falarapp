'use client'

import More from "@/components/MoreAllQuickies";
import PostComponent from "@/components/QuickieComponent";
import Search from "@/components/SearchComponent";
import Trending from "@/components/Trending";
import { AppConfig } from "@/config/config";
import { createClient } from "@/utils/supabase/client"; // <-- client version here
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import Link from "next/link";
import { useEffect, useState } from "react";

TimeAgo.addLocale(en);

export default function Index() {
  const supabase = createClient();
  const timeAgo = new TimeAgo("en-US");
  const date1 = new Date();
  const [quote,setQuote] = useState<boolean>(false);
  const [quoteid,setQuoteid] = useState<string>("");
  const [quotehandle,setQuotehandle] = useState<string>("");
  const [quotename,setQuotename] = useState<string>("");
  const [quotedisplay,setQuotedisplay] = useState<string>("");
  const [quoteimage,setQuoteimage] = useState<any[]>([]);
  const [quotephotocount,setQuotephotocount] = useState<number>(0);
  const [quotecontent,setQuotecontent] = useState<string>("");
  const [quotetime,setQuotetime] = useState<string>("");
  const [empty, setempty] = useState(true);
  const [posts, setposts] = useState<any[]>([]);
  const [loading, setloading] = useState(true);
  const [l, setl] = useState<any[]>([]);
  const [myname, setmyname] = useState("");
  const [myphoto, setmyphoto] = useState("");
  const [newblocked, setnewblocked] = useState<any[]>([]);
  const [myhandle, setmyhandle] = useState("");
  const [userliked, setuserliked] = useState<any[]>([]);
  const [userbookmarked, setuserbookmarked] = useState<any[]>([]);
  const [myblocked, setmyblocked] = useState<any[]>([]);

  useEffect(() => {
    async function get() {
      try {
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
          .select("*,user(id,name,handle,image)")
          .order("id", { ascending: false })
          .eq("to", 0)
          .not("poster", "in", `(${u![0]["blocked"].toString()})`)
          .not("poster", "in", `(${u![0]["blockedby"].toString()})`)
          .limit(5);

        if (error) {
          console.log(error);
          setloading(false);
          return;
        }

        const ds = data ?? [];
       
        for await (const [index, post] of ds.entries()) {
          let liked = false;
          if(ds[index]["quote"]){
            post.quote = true;
        post.quoteid = ds[index]["quoteid"];
        const { data: q } = await supabase.from("quickies").select("*, user (name, handle, id, image)").eq("id", post.quoteid);
        if (q) {
          post.quotehandle = q[0]["user"]["handle"];
          post.quotename = q[0]["user"]["name"];
          post.quotedisplay = q[0]["user"]["image"];
          post.quoteimage = q[0]["image"];
          
          if(post.quoteimage){
            post.quotephotocount = q[0]["image"].length;
          }
          post.quotecontent = q[0]["content"];
          const date2 = new Date(q[0].created_at)
          let d = date2;
          
          post.quotetime = timeAgo.format(Date.now() - (date1.getTime() - date2.getTime()));
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
          if(ds[index].to>0){
            const { data: u } = await supabase.from("user").select("*").eq("id", post.to);
            ds[index].parentname = u![0]["handle"];
            ds[index].parentid = ds[index].to;
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
      } catch (error) {
        console.error(error);
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
                  time={timeAgo.format(Date.now() - post.diff)}
                  key={post.id}
                  image={post.image}
     

quote={post.quote}
quoteid={post.quoteid}
quotehandle={post.quotehandle}
quotename={post.quotename}
quotedisplay={post.quotedisplay}
quoteimage={post.quoteimage}
quotephotocount={post.quotephotocount}
quotecontent={post.quotecontent}
quotetime={post.quotetime}
                  parentid={post.parentid}
                  parentname={post.parentname}
                  comments={post.comments}
                  userliked={userliked}
                  userbookmarked={userbookmarked}
                  bookmarkedlist={post.bookmarkedlist}
                  likedlist={post.likedlist}
                  userid={post.user.id}
                  myhandle={myhandle}
                  dp={post.user.image}
                  bookmarked={post.bookmarked}
                  liked={post.liked}
                  handle={post.handle}
                  name={post.user.name}
                  description={post.content}
                />
              ))
            ) : (
              <div className="flex content-center items-center px-10 mt-24 w-full sm:px-24 md:px-16 lg:px-24">
                <div className="flex flex-col gap-2 mx-auto max-w-max">
                  <h1 className="mx-auto text-lg font-semibold text-center text-neutral-300">
                    No Quickies To View!
                  </h1>
                  <h1 className="mx-auto text-sm text-center text-neutral-400">
                    Sad! No one has posted anything on this app yet. Be the first one to do so! Start by clicking on the
                    button with the feather icon in the left sidebar.
                  </h1>
                </div>
              </div>
            )
          ) : (
            <div className="flex content-center items-center w-full h-screen"></div>
          )}
          <More
            myblocked={myblocked}
            myhandle={myhandle}
            newblocked={newblocked}
            myname={myname}
            myphoto={myphoto}
            userliked={userliked}
            userbookmarked={userbookmarked}
          ></More>
       </div>
       </div>
       </div>
    </>
  );
}
