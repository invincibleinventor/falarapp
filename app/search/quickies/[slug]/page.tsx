"use client";
import More from "@/components/MoreQuickies";
import PostComponent from "@/components/QuickieComponent";
import Search from "@/components/SearchComponent";
import { createClient } from "@/utils/supabase/client";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import Link from "next/link";
import { use, useEffect, useState } from "react";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const {slug } = use(params)
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

  const timeAgo = new TimeAgo("en-US");
  const date1 = new Date();
  const [blocked, setBlocked] = useState<any>([]);
  const isSupabaseConnected = canInitSupabaseClient();
  const [empty, setEmpty] = useState(false);
  const [posts, setPosts] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [l, setL] = useState([]);
  const [myname, setMyname] = useState("");
  const [myphoto, setMyphoto] = useState("");
  const [myhandle, setMyhandle] = useState("");
  const [userliked, setUserliked] = useState([]);
  const [search, setSearch] = useState(slug);
  const [tempsearch, setTempSearch] = useState("");
const [newblocked,setnewblocked] = useState([])
  const [userbookmarked, setUserBookmarked] = useState([]);
  useEffect(() => {
    async function get() {
      const { data: user } = await supabase.auth.getUser();
      const s = user.user!.id;
      const { data: u } = await supabase.from("user").select("*").eq("id", s);
      setL(u![0]["following"]);
      const h = u![0]["handle"];
      setMyname(u![0]["name"]);
      setMyphoto(u![0]["image"]);
      setMyhandle(u![0]["handle"]);
      setUserBookmarked(u![0]["bookmarks"]);
      setUserliked(u![0]["liked"]);
      setBlocked(u![0]["blocked"]);
      setnewblocked(u![0]["blockedby"])
      let ds = [];
      const a: any = l;
      a.push(h);
      setL(a);
      const { data, error } = await supabase
        .from("quickies")
        .select("*,user(id,name,handle,image)")
        .order("id", { ascending: false })
        .not("poster", "in", `(${u![0]["blocked"].toString()})`)
        .not("poster", "in", `(${u![0]["blockedby"].toString()})`)

        .textSearch("content", `'${search}' | '${search.toLowerCase()}' | '${search.toUpperCase()}'`)

        .limit(5);
      if (error) {
      } else {
        ds = data;

        for await (const [index, post] of ds.entries()) {
          let liked = false;
          const likedlist: string | any[] = ds[index].liked;
          let bookmarked = false;
          const bookmarkedlist: any[] = ds[index].bookmarked;
          if (likedlist.includes(myhandle)) {
            liked = true;
          }
          if (bookmarkedlist.includes(myhandle)) {
            bookmarked = true;
          }

          ds[index].liked = liked;
          ds[index].bookmarked = bookmarked;
          ds[index].bookmarkedlist = bookmarkedlist;
          ds[index].likedlist = likedlist;

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

  if (isSupabaseConnected) {
    return (
      <>
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
                defaultValue={search.replaceAll("%20", " ")}
                onChange={(e) => setTempSearch(e.target.value.trim())}
                minLength={4}
                maxLength={50}
                type="search"
                className="font-inter md:mb-3 rounded-full peer h-[48px] w-full bg-neutral-700/20 focus:outline-none pl-6 pr-14 text-[14px] placeholder:text-neutral-400 text-neutral-300"
                placeholder={"Search Quickies"}
              ></input>
            </div>{" "}
          </div>
          <div className="h-full overflow-y-scroll hiddenscroll">
            <div className="flex flex-col gap-0 mb-20 animate-in hiddenscroll">
              {!loading ? (
                !empty ? (
                  posts.map((post: any) => (
                    <PostComponent
                      id={post.id}
                      cover={post.cover}
                      title={post.title}
                      time={timeAgo.format(Date.now() - post.diff)}
                      key={post.id}
                      image={post.image}
                      comments={post.comments}
                      userliked={userliked}
                      userbookmarked={userbookmarked}
                      bookmarkedlist={post.bookmarkedlist}
                      likedlist={post.likedlist}
                      myhandle={myhandle}
                      userid={post.user.id}

                      dp={post.user.image}
                      bookmarked={post.bookmarked}
                      liked={post.liked}
                      handle={post.handle}
                      name={post.user.name}
                      description={post.content}
                    />
                  ))
                ) : (
                  <div className="flex items-center content-center w-full px-10 mt-24 sm:px-24 md:px-16 lg:px-24">
                    <div className="flex flex-col gap-2 mx-auto max-w-max">
                      <h1 className="mx-auto text-lg font-semibold text-center text-neutral-300">No Quickies To View!</h1>
                      <h1 className="mx-auto text-sm text-center text-neutral-600">
                        Follow people to view their quickies on your feed. The more people you follow, the more quickies
                        on your feed
                      </h1>
                      <Link
                        href="/search/quickies"
                        className={`mx-auto mt-3 rounded-full w-max px-8 py-3 text-xs font-medium  ${
                          1 == 1 ? "bg-cyan-800 text-white" : "border-2 bg-white"
                        }`}
                      >
                        Search Something Else
                      </Link>
                    </div>
                  </div>
                )
              ) : (
                <div className="flex items-center content-center w-full h-screen"></div>
              )}
              <More
                myblocked={blocked}
                slug={search}
                myhandle={myhandle}
                newblocked={newblocked}
                myname={myname}
                myphoto={myphoto}
                userliked={userliked}
                userbookmarked={userbookmarked}
                in={l}
              ></More>{" "}
            </div>{" "}
          </div>
        </div>
      </>
    );
  } else {
    return <></>;
  }
}
