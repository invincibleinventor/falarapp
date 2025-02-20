"use client";
import PostComponent from "@/components/PostComponent";
import { createClient } from "@/utils/supabase/client";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { use, useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = createClient();
  const {slug} = use(params);
  const canInitSupabaseClient = () => {

    try {
      createClient();
      return true;
    } catch (e) {
      return false;
    }
  };

  const isSupabaseConnected = canInitSupabaseClient();
  const [posts, setPosts] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  TimeAgo.locale(en);
  const [empty, setEmpty] = useState(false);

  const timeAgo = new TimeAgo("en-US");
  const date1 = new Date();
  useEffect(() => {
    async function get() {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("handle", slug)
        .order("id", { ascending: false });
      if (error) {
        console.log(error);
      } else {
        console.log(data);
        const ds = data;
        for await (const [index, post] of ds.entries()) {
          const { data } = await supabase.from("user").select("*").eq("id", post.poster);
          if (data) {
            ds[index].name = data[0].name;

            ds[index].dp = data[0].image;

            const date2 = new Date(ds[index].created_at);
            ds[index].diff = date1.getTime() - date2.getTime();
          }
        }
        setPosts(ds);
        if (ds.length == 0) {
          setEmpty(true);
        }
        setLoading(false);
      }
    }
    get();
  }, []);
  if (isSupabaseConnected) {
    return (
      <div className="flex-1 h-screen p-0 py-2 overflow-hidden">
        <div className="p-4 py-2 mx-1 md:mx-1">
          <div className="relative items-center content-center lg:pr-0">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="md:bottom-3 absolute inset-y-0 right-0 my-auto mr-6 md:mr-10 lg:mr-6 h-[14px] w-[14px] text-neutral-400"
            >
              <g>
                <path
                  fill="currentColor"
                  d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"
                ></path>
              </g>
            </svg>
            <input
              minLength={4}
              maxLength={50}
              type="search"
              className="font-inter md:mb-3 rounded-full peer h-[48px] w-full bg-neutral-700/20 focus:outline-none pl-6 pr-14 text-[14px] placeholder:text-neutral-400 text-neutral-300"
              placeholder={"Search " + slug + "'s posts"}
            ></input>
          </div>
        </div>
        <div className="h-full overflow-y-scroll hiddenscroll">
          <div className="flex flex-col gap-2 mb-20 animate-in hiddenscroll">
            {!loading ? (
              posts.map((post: any) => (
                <PostComponent
                  id={post["id"]}
                  title={post["title"]}
                  cover={post["cover"]}
                  time={timeAgo.format(Date.now() - post["diff"])}
                  key={post["id"]}
                  image={post["image"]}
                  dp={post["dp"]}
                  handle={post["handle"]}
                  name={post["name"]}
                  description={post["excerpt"]}
                />
              ))()
            ) : (
              <div className="flex items-center content-center w-full h-screen">
                <Oval
                  height={80}
                  width={80}
                  color="#000000"
                  wrapperStyle={{}}
                  wrapperClass="mx-auto"
                  visible={true}
                  ariaLabel="oval-loading"
                  secondaryColor="#808080"
                  strokeWidth={2}
                  strokeWidthSecondary={2}
                />
              </div>
            )}{" "}
          </div>{" "}
        </div>
      </div>
    );
  } else {
  }
}
