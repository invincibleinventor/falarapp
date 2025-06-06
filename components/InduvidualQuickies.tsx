"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import More from "@/components/MoreInduvidualQuickies";
import PostComponent from "@/components/QuickieComponent";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

export default function Index(props: any) {
  const [posts, setPosts] = useState<any[]>([]);
  const [userliked, setUserLiked] = useState<any[]>([]);
  const [userbookmarked, setUserBookmarked] = useState<any[]>([]);
  const [myblocked, setMyBlocked] = useState<any[]>([]);
  const [newblocked, setNewBlocked] = useState<any[]>([]);
  const [myhandle, setMyHandle] = useState("");
  const [myname, setMyName] = useState("");
  const [myphoto, setMyPhoto] = useState("");
  const [l, setL] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(true);

  const [quote, setQuote] = useState<boolean>(false);
  const [quoteid, setQuoteid] = useState<string>("");
  const [quotehandle, setQuotehandle] = useState<string>("");
  const [quotename, setQuotename] = useState<string>("");
  const [quotedisplay, setQuotedisplay] = useState<string>("");
  const [quoteimage, setQuoteimage] = useState<any[]>([]);
  const [quotephotocount, setQuotephotocount] = useState<number>(0);
  const [quotecontent, setQuotecontent] = useState<string>("");
  const [quotetime, setQuotetime] = useState<string>("");

  useEffect(() => {
    const supabase = createClient();
    const date1 = new Date();

    const getData = async () => {
      const { data, error } = await supabase
        .from("quickies")
        .select(`*, user (name, id, handle, image)`)
        .order("id", { ascending: false })
        .eq("handle", props.handle)

        .limit(5);

      if (error) {
        console.log(error);
        setLoading(false);
        return;
      }
      const enrichedPosts: any[] = [];

      for (const post of data) {
        let parentname: any = null;
        let parentid: any = null;
        if (post["quote"]) {
          post.quote = true;
          post.quoteid = post["quoteid"];
          const { data: q } = await supabase
            .from("quickies")
            .select("*, user (name, handle, id, image)")
            .eq("id", post.quoteid);
          if (q) {
            post.quotehandle = q[0]["user"]["handle"];
            post.quotename = q[0]["user"]["name"];
            post.quotedisplay = q[0]["user"]["image"];
            post.quoteimage = q[0]["image"];

            if (post.quoteimage) {
              post.quotephotocount = q[0]["image"].length;
            }
            post.quotecontent = q[0]["content"];
            const date2 = new Date(q[0].created_at);
            let d = date2;

            post.quotetime = timeAgo.format(Date.now() - (date1.getTime() - date2.getTime()));
          }
        }
        if (post.to > 0) {
          const { data: u } = await supabase
            .from("quickies")
            .select(
              `*, 
            user (
            
              handle
            
            )`
            )
            .eq("id", post.to);

          if (u && u.length) {
            parentname = u?.[0]?.user.handle;
          }
          parentid = post.to;
        }
        const liked = false;
        const bookmarked = false;

        const date2 = new Date(post.created_at);
        const diff = date1.getTime() - date2.getTime();

        enrichedPosts.push({
          ...post,
          parentname,
          parentid,
          liked,
          bookmarked,
          likedlist: post.liked,
          bookmarkedlist: post.bookmarked,
          diff,
        });
      }

      setPosts(enrichedPosts);
      setEmpty(enrichedPosts.length === 0);
      setLoading(false);
    };

    getData();
  }, []);

  return (
    <div className="flex flex-col gap-2 px-0 md:px-0">
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
              comments={post.comments}
              userliked={userliked}
              parentname={post.parentname}
              parentid={post.parentid}
              userid={post.user.id}
              userbookmarked={userbookmarked}
              bookmarkedlist={post.bookmarkedlist}
              likedlist={post.likedlist}
              myhandle={myhandle}
              dp={post.user.image}
              bookmarked={post.bookmarked}
              liked={post.liked}
              handle={post.handle}
              name={post.user.name}
              description={post.content}
              quote={post.quote}
              quoteid={post.quoteid}
              quotehandle={post.quotehandle}
              quotename={post.quotename}
              quotedisplay={post.quotedisplay}
              quoteimage={post.quoteimage}
              quotephotocount={post.quotephotocount}
              quotecontent={post.quotecontent}
              quotetime={post.quotetime}
            />
          ))
        ) : (
          <div className="flex content-center items-center px-10 mt-24 w-full sm:px-24 md:px-16 lg:px-24">
            <div className="flex flex-col gap-2 mx-auto max-w-max">
              <h1 className="mx-auto text-lg font-semibold text-center text-neutral-300">No Quickies To View!</h1>
              <h1 className="mx-auto text-sm text-center text-neutral-400">
                The user you are viewing hasn't posted any quickies yet.
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
        myname={myname}
        myphoto={myphoto}
        handle={props.handle}
        newblocked={newblocked}
        userliked={userliked}
        userbookmarked={userbookmarked}
        in={l}
      />
    </div>
  );
}
