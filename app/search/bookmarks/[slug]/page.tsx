"use client";
import MoreBookMarks from "@/components/MoreBookMarks";
import PostComponent from "@/components/PostComponent";
import { createClient } from "@/utils/supabase/client";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const {slug} = use(params);
  const supabase = createClient();
  const canInitSupabaseClient = () => {
    // This function is just for the interactive tutorial.
    // Feel free to remove it once you have Supabase connected.
    try {
      createClient();
      return true;
    } catch (e) {
      return false;
    }
  };
  TimeAgo.locale(en);
  const [search, setSearch] = useState(slug);
  const [tempsearch, setTempSearch] = useState("");
  const timeAgo = new TimeAgo("en-US");

  const date1 = new Date();
  const isSupabaseConnected = canInitSupabaseClient();
  const [empty, setEmpty] = useState(true);
  const [posts, setPosts] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [blocked, setBlocked] = useState([]);
  const [newblocked,setnewblocked] = useState([])
  useEffect(() => {
    async function get() {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      const s = user?.user?.id;
      const { data: u } = await supabase.from("user").select("*").eq("id", s);

      let l = [];
      let blocked = [];
      let newblocked = [];
      if (u) {
        blocked = u[0]["blocked"];
        newblocked = u[0]["blockedby"]
        l = u[0]["bookmarks"];
      }
      console.log("below");
      console.log(l);
      let ds = [];
      setBlocked(blocked);
      setnewblocked(newblocked)
      const { data, error } = await supabase
        .from("posts")
        .select("*,user(id,name,handle,image)")
        .order("id", { ascending: false })
        .textSearch("title_excerpt_content", `'${search}' | '${search.toLowerCase()}' | '${search.toUpperCase()}'`)
        .in("id", l)
        .not("id", "in", `(${blocked.toString()})`)
        .not("id", "in", `(${newblocked.toString()})`)
        .limit(5);
      if (error) {
        console.log(error);
      } else {
        console.log(data);
        ds = data;

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

        console.log(ds);
        console.log(posts);
      }
    }
    get();
  }, [search]);
  if (isSupabaseConnected) {
    return (
      <div className="flex-1 h-screen p-0 py-2 overflow-hidden">
        <div className="p-4 py-2 mx-1 md:mx-1">
          <div className="relative items-center content-center">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="md:bottom-3 absolute inset-y-0 right-0 my-auto mr-6 h-[14px] w-[14px] text-neutral-400"
            >
              <g>
                <path
                  fill="currentColor"
                  d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"
                ></path>
              </g>
            </svg>
            <input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (tempsearch != "") {
                    setSearch(tempsearch);
                  } else {
                    setEmpty(true);
                  }
                }
              }}
              defaultValue={search}
              onChange={(e) => setTempSearch(e.target.value.trim())}
              minLength={4}
              maxLength={50}
              type="search"
              className="font-inter md:mb-3 rounded-full peer h-[48px] w-full bg-neutral-700/20 focus:outline-none pl-6 pr-14 text-[14px] placeholder:text-neutral-400 text-neutral-300"
              placeholder={"Search Posts"}
            ></input>
          </div>
        </div>
        <div className="h-full overflow-y-scroll hiddenscroll">
          <div className="flex flex-col gap-2 mb-20 animate-in hiddenscroll">
            {!loading ? (
              !empty ? (
                posts.map((post: any) => (
                  <PostComponent
                    id={post.id}
                    title={post.title}
                    time={timeAgo.format(Date.now() - post.diff)}
                    key={post.id}
                    image={post.image}
                    dp={post.user.image}
                    handle={post.handle}
                    userid={post.user.id}

                    cover={post.cover}
                    name={post.user.name}
                    description={post.excerpt}
                  />
                ))
              ) : (
                <div className="flex items-center content-center w-full px-10 mt-24 sm:px-24 md:px-16 lg:px-24">
                  <div className="flex flex-col gap-4 mx-auto max-w-max">
                    <h1 className="mx-auto text-xl font-semibold text-center text-neutral-300">No Posts To View!</h1>
                    <h1 className="mx-auto text-sm text-center text-neutral-500">
                      Your bookmarked posts appear in here. Seems like you have not bookmarked anything that matches
                      your search. Bookmark posts to view them here.
                    </h1>
                    <Link
                      href="/"
                      className={`mx-auto mt-3 rounded-full w-max px-8 py-3 text-xs font-medium  ${
                        1 == 1 ? "bg-cyan-800 text-white" : "border-2 bg-white"
                      }`}
                    >
                      Return To Home
                    </Link>
                  </div>
                </div>
              )
            ) : (
              <div className="flex items-center content-center w-full h-screen">
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
            <MoreBookMarks newblocked={newblocked} myblocked={blocked} slug={search} />{" "}
          </div>{" "}
        </div>
      </div>
    );
  } else {
  }
}
