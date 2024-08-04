import More from "@/components/BookMarksMore";
import PostComponent from "@/components/PostComponent";
import Search from "@/components/SearchComponent";
import { createClient } from "@/utils/supabase/server";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { cookies } from "next/headers";
import Link from "next/link";
export default async function Index() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const canInitSupabaseClient = () => {
    // This function is just for the interactive tutorial.
    // Feel free to remove it once you have Supabase connected.
    try {
      createClient(cookieStore);
      return true;
    } catch (e) {
      return false;
    }
  };
  TimeAgo.locale(en);

  const timeAgo = new TimeAgo("en-US");
  const date1 = new Date();
  const isSupabaseConnected = canInitSupabaseClient();
  let empty = true;
  let myblocked: any[] = []
  let posts: any[] = [];
  let loading = true;
  let l: readonly any[] = [];
  async function get() {
    const { data: user } = await supabase.auth.getUser();
    const s = user?.user?.id;
    const { data: u } = await supabase.from("user").select("*").eq("id", s);
    if (u) {
      l = u[0]["bookmarks"];
      myblocked = u[0]["blocked"]
    }
    console.log("below");
    console.log(l);
    let ds = [];

    const { data, error } = await supabase
      .from("posts")
      .select("*,user(name,handle,image)")
      .order("id", { ascending: false })
      .in("id", l)
      .not("poster","in",`(${myblocked.toString()})`)
      .limit(5);
    if (error) {
    } else {
      ds = data;

      for await (const [index, post] of ds.entries()) {
      
          const date2 = new Date(ds[index].created_at);
          ds[index].diff = date1.getTime() - date2.getTime();
        
      }
      if (ds.length > 0) {
        empty = false;
      } else {
        empty = true;
      }
      posts = ds;
      loading = false;
    }
  }
  await get();
  if (isSupabaseConnected) {
    return (
      <>
        <div className="flex-1 h-screen p-0 py-2 overflow-hidden">
          <div className="p-4 py-2 mx-1 md:mx-1">
            <Search page="bookmarks" text="Bookmarks" />
          </div>
          <h1 className="px-8 my-4 mt-4 text-xl font-bold text-gray-300">My Bookmarks</h1>
          <div className="h-full overflow-y-scroll hiddenscroll">
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
                  <div className="flex items-center content-center w-full px-10 mt-24 sm:px-24 md:px-16 lg:px-24">
                    <div className="flex flex-col gap-4 mx-auto max-w-max">
                      <h1 className="mx-auto text-lg font-semibold text-center text-gray-300">No Posts To View!</h1>
                      <h1 className="mx-auto text-center text-gray-500 rounded-md text-md">
                        Your bookmarked posts appear in here. Seems like you have not bookmarked anything yet. Bookmark
                        posts to view them here.
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
                <div className="flex items-center content-center w-full h-screen"></div>
              )}
              <More myblocked = {myblocked} l={l}></More>{" "}
            </div>{" "}
          </div>
        </div>
      </>
    );
  } else {
    return <></>;
  }
}
