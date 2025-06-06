"use client";
import MoreBookMarks from "@/components/MoreBookMarks";
import PostComponent from "@/components/PostComponent";
import Search from "@/components/SearchComponent";
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
      <div className="overflow-hidden flex-1 p-0 py-2 h-screen">
        <div className="p-4 py-2 mx-1 md:mx-1">
          <Search text="Bookmarks" page="bookmarks" search={search.replaceAll("%20", " ")} />
        </div>
        <div className="overflow-y-scroll h-full hiddenscroll">
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
                <div className="flex content-center items-center px-10 mt-24 w-full sm:px-24 md:px-16 lg:px-24">
                  <div className="flex flex-col gap-4 mx-auto max-w-max">
                    <h1 className="mx-auto text-xl font-semibold text-center text-neutral-300">No Posts To View!</h1>
                    <h1 className="mx-auto text-sm text-center text-neutral-400">
                      Your bookmarked posts appear in here. Seems like you have not bookmarked anything that matches
                      your search. Bookmark posts to view them here.
                    </h1>
                    <Link
                      href="/all"
                      className={`mx-auto mt-3 rounded-full w-max px-8 py-3 text-xs font-medium  ${
                        1 == 1 ? "bg-primary-700 text-white" : "border-2 bg-white"
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
            <MoreBookMarks newblocked={newblocked} myblocked={blocked} slug={search} />{" "}
          </div>{" "}
        </div>
      </div>
    );
  } else {
  }
}
