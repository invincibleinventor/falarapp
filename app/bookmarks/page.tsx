/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import More from "@/components/BookMarksMore";
import PostComponent from "@/components/PostComponent";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [empty, setEmpty] = useState(true);
  const [l, setL] = useState<any[]>([]);
  const [myblocked, setMyBlocked] = useState<any[]>([]);
  const [newblocked, setNewBlocked] = useState<any[]>([]);

  const supabase = createClient();

  useEffect(() => {
    async function get() {
      const date1 = new Date();

      const { data: user } = await supabase.auth.getUser();
      const s = user?.user?.id;

      const { data: u } = await supabase.from("user").select("*").eq("id", s);
      if (u && u.length > 0) {
        const bookmarks = u[0]["bookmarks"] || [];
        const blocked = u[0]["blocked"] || [];
        const blockedby = u[0]["blockedby"] || [];

        setL(bookmarks);
        setMyBlocked(blocked);
        setNewBlocked(blockedby);

        const { data, error } = await supabase
          .from("posts")
          .select("*,user(id,name,handle,image)")
          .order("id", { ascending: false })
          .in("id", bookmarks)
          .not("poster", "in", `(${blocked.toString()})`)
          .not("poster", "in", `(${blockedby.toString()})`)
          .limit(5);

        if (!error && data) {
          for (let i = 0; i < data.length; i++) {
            const date2 = new Date(data[i].created_at);
            data[i].diff = date1.getTime() - date2.getTime();
          }

          setPosts(data);
          setEmpty(data.length === 0);
        }
      }

      setLoading(false);
    }

    get();
  }, []);

  return (
    <>
      <div className="overflow-hidden flex-1 p-0 py-2 h-screen">
        <div className="overflow-y-scroll h-full hiddenscroll">
          <div className="flex flex-col gap-2 mb-20 animate-in hiddenscroll">
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
                    dp={post.user.image}
                    likes={post.likes}
                    handle={post.handle}
                    name={post.user.name}
                    description={post.excerpt}
                  />
                ))
              ) : (
                <div className="flex content-center items-center px-10 mt-24 w-full sm:px-24 md:px-16 lg:px-24">
                  <div className="flex flex-col gap-4 mx-auto max-w-max">
                    <h1 className="mx-auto text-lg font-semibold text-center text-neutral-300">No Posts To View!</h1>
                    <h1 className="mx-auto text-center rounded-md text-neutral-400 text-md">
                      Your bookmarked posts appear in here. Seems like you have not bookmarked anything yet. Bookmark
                      posts to view them here.
                    </h1>
                    <Link
                      href="/"
                      className={`mx-auto mt-3 rounded-full w-max px-8 py-3 text-xs font-medium  ${
                        1 == 1 ? "bg-primary-700 text-white" : "border-2 bg-white"
                      }`}
                    >
                      Return To Home
                    </Link>
                  </div>
                </div>
              )
            ) : (
              <div className="flex content-center items-center w-full h-screen"></div>
            )}
            <More newblocked={newblocked} myblocked={myblocked} l={l}></More>
          </div>
        </div>
      </div>
    </>
  );
}
