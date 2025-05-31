'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import More from "@/components/MoreBookmarkQuickies";
import PostComponent from "@/components/QuickieComponent";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

export default function Index() {
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

  useEffect(() => {
    const supabase = createClient();
    const date1 = new Date();

    const getData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const s = userData.user.id;
      const { data: userDetails } = await supabase.from("user").select("*").eq("id", s);

      if (!userDetails || userDetails.length === 0) return;
      const currentUser = userDetails[0];

      const following = currentUser.following;
      setL(currentUser.quickiebookmarks);
      setUserBookmarked(currentUser.quickiebookmarks);
      setUserLiked(currentUser.quickieliked);
      setMyBlocked(currentUser.blocked);
      setNewBlocked(currentUser.blockedby);
      setMyHandle(currentUser.handle);
      setMyName(currentUser.name);
      setMyPhoto(currentUser.image);

      const { data, error } = await supabase
        .from("quickies")
        .select(`*, user (name, id, handle, image)`)
        .order("id", { ascending: false })
        .in("id", currentUser.quickiebookmarks)
        .eq("parent", 0)
        .not("poster", "in", `(${currentUser.blocked.toString()})`)
        .not("poster", "in", `(${currentUser.blockedby.toString()})`)
        .limit(5);

      if (error) {
        console.log(error);
        setLoading(false);
        return;
      }

      const enrichedPosts = data.map((post: any) => {
        const liked = post.liked.includes(currentUser.handle);
        const bookmarked = post.bookmarked.includes(currentUser.handle);
        const date2 = new Date(post.created_at);
        const diff = date1.getTime() - date2.getTime();
        return {
          ...post,
          liked,
          bookmarked,
          likedlist: post.liked,
          bookmarkedlist: post.bookmarked,
          diff,
        };
      });

      setPosts(enrichedPosts);
      setEmpty(enrichedPosts.length === 0);
      setLoading(false);
    };

    getData();
  }, []);

  return (
    <div className="overflow-hidden flex-1 p-0 py-2 h-screen">

      <h1 className="px-8 my-4 mt-4 text-xl font-bold text-neutral-300">My Bookmarks</h1>

      <div className="overflow-y-scroll py-2 h-full hiddenscroll">

      <div className="flex flex-col gap-0 mb-20 animate-in hiddenscroll">
        <div className="parent-container">{/* <Stories /> */}</div>

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
                  className="px-8 py-3 mx-auto mt-3 w-max text-xs font-medium text-white rounded-full bg-primary-800"
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
        />
      </div>
      </div>
    </div>
  );
}
