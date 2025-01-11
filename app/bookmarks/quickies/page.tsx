import More from "@/components/MoreBookmarkQuickies";
import PostComponent from "@/components/QuickieComponent";
import Search from "@/components/SearchComponent";
import Stories from "@/components/stories";
import Trending from "@/components/Trending";
import { AppConfig } from "@/config/config";
import { createClient } from "@/utils/supabase/server";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Index() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const canInitSupabaseClient = () => {

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
  let posts: any[] = [];
  let loading = true;
  let l: any[] = [];
  let myname = "";
  let myphoto = "";
  let myhandle = "";
  let userliked: any[] = [];
  let newblocked :any[] =[] 
  let userbookmarked: any[] = [];
  let myblocked: any[] = [];
  async function get() {
    const { data: user } = await supabase.auth.getUser();
    const s = user.user!.id;

    const { data: u } = await supabase.from("user").select("*").eq("id", s);
    l = u![0]["following"];
    const h = u![0]["handle"];
    myname = u![0]["name"];
    myphoto = u![0]["image"];
    myblocked = u![0]["blocked"];
    newblocked = u![0]["blockedby"]
    myhandle = u![0]["handle"];
    userbookmarked = u![0]["quickiebookmarks"];
    userliked = u![0]["quickieliked"];
    let ds = [];
    l = userbookmarked
        const { data, error } = await supabase
      .from("quickies")
      .select(
        `*, 
        user (
        name,
        id,
        handle,
        image
        )`
      )
      .order("id", { ascending: false })
      .in("id", l)
      .eq("parent",0)
      .not("poster", "in", `(${myblocked.toString()})`)
      .not("poster", "in", `(${newblocked.toString()})`)
      .limit(5);
    if (error) {
      console.log(error);
    } else {
      ds = data;
      console.log("okok");
      console.log(ds);

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
        <div className="h-full py-2 overflow-y-scroll hiddenscroll">
        <h1 className="px-8 my-4 mt-4 text-xl font-bold text-neutral-300">My Bookmarks</h1>

          <div className="flex flex-col gap-0 mb-20 animate-in hiddenscroll">
            <div className="parent-container">{/* <Stories></Stories> */}</div>
            
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
                <div className="flex items-center content-center w-full px-10 mt-24 sm:px-24 md:px-16 lg:px-24">
                  <div className="flex flex-col gap-2 mx-auto max-w-max">
                    <h1 className="mx-auto text-lg font-semibold text-center text-neutral-300">No Quickies To View!</h1>
                    <h1 className="mx-auto text-sm text-center text-neutral-400">
                      Follow people to view their quickies on your feed. The more people you follow, the more quickies
                      on your feed
                    </h1>
                    <Link
                      href="/explore"
                      className={`mx-auto mt-3 rounded-full w-max px-8 py-3 text-xs font-medium  ${
                        1 == 1 ? "bg-primary-800 text-white" : "border-2 bg-white"
                      }`}
                    >
                      Explore People
                    </Link>
                  </div>
                </div>
              )
            ) : (
              <div className="flex items-center content-center w-full h-screen"></div>
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
            ></More>{" "}
          </div>{" "}
        </div>
      </>
    );
  } else {
    return <></>;
  }
}
