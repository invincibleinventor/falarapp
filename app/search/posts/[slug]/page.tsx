"use client";

import MoreSearchPosts from "@/components/MoreSearchPosts";
import PostComponent from "@/components/PostComponent";
import Search from "@/components/SearchComponent";
import { createClient } from "@/utils/supabase/client";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const supabase = createClient();

  TimeAgo.locale(en);
  const date1 = new Date();
  const timeAgo = new TimeAgo("en-US");

  const [search, setSearch] = useState(slug);
  const [tempsearch, setTempSearch] = useState("");
  const [empty, setEmpty] = useState(true);
  const [posts, setPosts] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [blocked, setblocked] = useState([]);
  const [newblocked, setnewblocked] = useState([]);
  useEffect(() => {
    async function get() {
      setLoading(true);
      let id;
      let blocked;
      let newblocked;
      const { data: u } = await supabase.auth.getUser();
      if (u.user) {
        id = u.user.id;
        const { data, error } = await supabase.from("user").select("*").eq("id", id);
        if (data && data.length > 0) {
          setblocked(data[0]["blocked"]);
          setnewblocked(data[0]["blockedby"]);
          blocked = data[0]["blocked"];
          newblocked = data[0]["blockedby"];
        } else {
          if (error) {
          }
        }
      }
      const { data, error } = await supabase
        .from("posts")
        .select("*,user(id,name,handle,image)")
        .order("id", { ascending: false })
        .textSearch("title_excerpt_content", `'${search}' | '${search.toLowerCase()}' | '${search.toUpperCase()}'`)
        .limit(5)
        .not("poster", "in", `(${blocked.toString()})`)
        .not("poster", "in", `(${newblocked.toString()})`);
      if (error) {
        console.log(error);
      } else {
        const ds = data;

        for await (const [index, post] of ds.entries()) {
          const date2 = new Date(ds[index].created_at);
          ds[index].diff = date1.getTime() - date2.getTime();
        }
        if (ds.length > 0) {
          setEmpty(false);
        } else {
          setEmpty(true);
        }
        setPosts(ds);
        setLoading(false);
      }
    }
    get();
  }, [search]);

  return (
    <div className="overflow-hidden flex-1 p-0 py-2 h-screen">
      <div className="p-4 py-2 mx-1 md:mx-1">
        <Search text="Posts" page="posts" value={search.replaceAll("%20", " ")} />
      </div>
      <div className="overflow-y-scroll h-full hiddenscroll">
        <div className="flex flex-col gap-2 mb-20 animate-in hiddenscroll">
          {!loading ? (
            !empty ? (
              posts.map((post: any) => (
                <PostComponent
                  cover={post.cover}
                  id={post.id}
                  title={post.title}
                  userid={post.user.id}
                  time={timeAgo.format(Date.now() - post.diff)}
                  key={post.id}
                  image={post.user.image}
                  dp={post.dp}
                  handle={post.handle}
                  name={post.user.name}
                  likes={post.likes}
                  description={post.excerpt}
                />
              ))
            ) : (
              <div className="flex content-center items-center px-10 mt-24 w-full sm:px-24 md:px-16 lg:px-24">
                <div className="flex flex-col gap-4 mx-auto max-w-max">
                  <h1 className="mx-auto text-xl font-semibold text-center text-neutral-300">No Posts To View!</h1>
                  <h1 className="mx-auto text-sm text-center text-neutral-400">
                    Your search results appear here. Seems like there are no posts related to your search term. Explore
                    other posts maybe?
                  </h1>
                  <Link
                    href="/all"
                    className={`mx-auto mt-5 w-max px-8  py-3 text-xs font-medium  ${
                      1 == 1 ? "bg-primary-700 rounded-full  text-white" : "border-2 bg-white"
                    }`}
                  >
                    Explore Posts
                  </Link>
                </div>
              </div>
            )
          ) : (
            <div className="flex content-center items-center w-full h-screen">
              <Oval
                height={80}
                width={80}
                color="#FFFFFF"
                wrapperStyle={{}}
                wrapperClass="mx-auto mt-5"
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#808080"
                strokeWidth={2}
                strokeWidthSecondary={2}
              />
            </div>
          )}
          <MoreSearchPosts newblocked={newblocked} myblocked={blocked} slug={search} />{" "}
        </div>{" "}
      </div>
    </div>
  );
}
