import More from "@/components/MoreAllQuickies";
import PostComponent from "@/components/QuickieComponent";
import Search from "@/components/SearchComponent";
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
  let posts: any[] = [];
  let loading = true;
  let l: any[] = [];
  let myname = "";
  let myphoto = "";
  let newblocked:any[] =[]
  let myhandle = "";
  let userliked: any[] = [];
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
    myhandle = u![0]["handle"];
    newblocked = u![0]["blockedby"]
    userbookmarked = u![0]["bookmarks"];
    userliked = u![0]["liked"];
    let ds = [];

    l.push(h);
    const { data, error } = await supabase
      .from("quickies")
      
      .select("*,user(id,name,handle,image)")
      .order("id", { ascending: false })
      .eq("parent",0)

      .not("poster", "in", `(${myblocked.toString()})`)
      .not("poster", "in", `(${newblocked.toString()})`)
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
        <div className="h-full overflow-y-scroll hiddenscroll">
          <div className="flex flex-col gap-0 mb-20 animate-in hiddenscroll">
            <div className=" lg:hidden">
              <Trending />
            </div>
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
                    userbookmarked={userbookmarked}
                    bookmarkedlist={post.bookmarkedlist}
                    likedlist={post.likedlist}
                    userid={post.user.id}

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
                    <h1 className="mx-auto text-lg font-semibold text-center text-gray-300">No Quickies To View!</h1>
                    <h1 className="mx-auto text-sm text-center text-gray-400">
                      Sad! No one has posted anything on this app yet. Be the first one to do so! Start by clicking on
                      the button with the feather icon in the left sidebar.
                    </h1>
                  </div>
                </div>
              )
            ) : (
              <div className="flex items-center content-center w-full h-screen"></div>
            )}
            <More
              myblocked={myblocked}
              myhandle={myhandle}
              newblocked={newblocked}
              myname={myname}
              
              myphoto={myphoto}
              userliked={userliked}
              userbookmarked={userbookmarked}
            ></More>{" "}
          </div>{" "}
        </div>
      </>
    );
  } else {
    return <></>;
  }
}
