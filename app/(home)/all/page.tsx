/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Landing from "@/components/landing";
import More from "@/components/More";
import PostComponent from "@/components/PostComponent";
import { createClient } from "@/utils/supabase/client";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useEffect, useState } from "react";
import Link from "next/link";

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

export default function Index() {
  const supabase = createClient();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(true);
  const [loggedin, setLoggedin] = useState(false);
  const [newblocked, setNewBlocked] = useState<any[]>([]);
  const [myblocked, setMyBlocked] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const s = user.user.id;
      const { data: u, error: uErr } = await supabase.from("user").select("*").eq("id", s);
      if (!u || u.length === 0 || uErr) return;

      const userData = u[0];
      const l = [...userData.following, userData.handle];
      setFollowing(l);
      setMyBlocked(userData.blocked);
      setNewBlocked(userData.blockedby);
      setLoggedin(true);

      const { data, error } = await supabase
        .from("posts")
        .select("*,user(id,name,handle,image)")
        .order("id", { ascending: false })
        .in("handle", l)
        .not("poster", "in", `(${userData.blocked.toString()})`)
        .not("poster", "in", `(${userData.blockedby.toString()})`)
        .limit(5);

      if (error || !data) return;

      const date1 = new Date();
      const enriched = data.map((post) => {
        const date2 = new Date(post.created_at);
        post.diff = date1.getTime() - date2.getTime();
        return post;
      });

      setPosts(enriched);
      setEmpty(enriched.length === 0);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="overflow-y-scroll py-2 hiddenscroll">

        {!loading ? (
          !empty ? (
            posts.map((post) => (
              <PostComponent
                key={post.id}
                id={post.id}
                cover={post.cover}
                title={post.title}
                time={timeAgo.format(Date.now() - post.diff)}
                image={post.image}
                dp={post.user.image}
                handle={post.handle}
                likes={post.likes}
                userid={post.user.id}
                name={post.user.name}
                description={post.excerpt}
              />
            ))
          ) : (
            <div className="flex content-center items-center px-10 mt-24 w-full sm:px-24 md:px-16 lg:px-24">
              <div className="flex flex-col gap-2 mx-auto max-w-max">
                <h1 className="mx-auto text-lg font-semibold text-center text-neutral-300">No Posts To View!</h1>
                <h1 className="mx-auto text-sm text-center text-neutral-400">
                  Follow people to view their posts on your home feed. The more people you follow, the more posts on your feed
                </h1>
                <Link
                  href="/explore"
                  className={`px-8 py-3 mx-auto mt-3 w-max text-xs font-medium text-white rounded-full bg-primary-800`}
                >
                  Explore People
                </Link>
              </div>
            </div>
          )
        ) : (
          <div className="flex content-center items-center w-full h-screen"></div>
        )}
        <More newblocked={newblocked} myblocked={myblocked} in={following}></More>
</div>
  );
}
