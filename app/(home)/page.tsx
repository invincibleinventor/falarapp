'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import PostComponent from "@/components/PostComponent";
import More from "@/components/More";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.addLocale(en);

export default function Index() {

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(true);
  const [newblocked, setNewBlocked] = useState<any[]>([]);
  const [myblocked, setMyBlocked] = useState<any[]>([]);
  const [l, setL] = useState<any[]>([]);
  const timeAgo = new TimeAgo("en-US");

  useEffect(() => {
    const get = async () => {
      const supabase = createClient();
      let ls = false;
      const { data: user } = await supabase.auth.getUser();

      let s: any;
      if (user.user) {
        s = user.user.id;
        ls = true;
      } else {
        setLoading(false);
        return;
      }

      const { data: u, error: uErr } = await supabase.from("user").select("*").eq("id", s);
      if (!u || u.length === 0 || uErr) {
        setLoading(false);
        return;
      }

      const followList = u[0]["following"];
      const myBlocked = u[0]["blocked"];
      const newBlocked = u[0]["blockedby"];
      const h = u[0]["handle"];
      const finalHandles = [...followList, h];
      const date1 = new Date();

      const { data, error } = await supabase
        .from("posts")
        .select("*,user(id,name,handle,image)")
        .order("id", { ascending: false })
        .in("handle", finalHandles)
        .not("poster", "in", `(${myBlocked.toString()})`)
        .not("poster", "in", `(${newBlocked.toString()})`)
        .limit(5);

      if (!error && data) {
        const updated = data.map((post) => {
          const date2 = new Date(post.created_at);
          return {
            ...post,
            diff: date1.getTime() - date2.getTime(),
          };
        });
        setPosts(updated);
        setEmpty(updated.length === 0);
      }

      setMyBlocked(myBlocked);
      setNewBlocked(newBlocked);
      setL(finalHandles);
      setLoading(false);
    };

    get();
  }, []);

  if (loading) {
    return <div className="flex content-center items-center w-full h-screen">Loading...</div>;
  }

  if (empty) {
    return (
      <div className="flex content-center items-center px-10 mt-24 w-full sm:px-24 md:px-16 lg:px-24">
        <div className="flex flex-col gap-2 mx-auto max-w-max">
          <h1 className="mx-auto text-lg font-semibold text-center text-neutral-300">No Posts To View!</h1>
          <h1 className="mx-auto text-sm text-center text-neutral-400">
            Follow people to view their posts on your home feed. The more people you follow, the more posts on
            your feed
          </h1>
          <Link
            href="/explore"
            className={`px-8 py-3 mx-auto mt-3 w-max text-xs font-medium text-white rounded-full bg-primary-800`}
          >
            Explore People
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-scroll py-2 hiddenscroll">

      {posts.map((post) => (
        <PostComponent
          id={post.id}
          cover={post.cover}
          title={post.title}
          time={timeAgo.format(Date.now() - post.diff)}
          key={post.id}
          image={post.image}
          dp={post.user.image}
          handle={post.handle}
          likes={post.likes}
          userid={post.user.id}
          name={post.user.name}
          description={post.excerpt}
        />
      ))}
      <More newblocked={newblocked} myblocked={myblocked} in={l}></More>
    </div>
  );


}