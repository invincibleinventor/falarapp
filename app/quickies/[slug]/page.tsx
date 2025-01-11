import More from "@/components/MoreQuickies";
import PostComponent from "@/components/QuickieComponent";
import Search from "@/components/SearchComponent";
import Trending from "@/components/Trending";
import { AppConfig } from "@/config/config";
import { createClient } from "@/utils/supabase/server";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Index({ params }: { params: Promise<{ slug: string }> }) {
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
const slug = (await params).slug;
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
  let userbookmarked: any[] = [];
  let myblocked = "";
  let newblocked: any[] = []

  async function get() {
    const { data: user } = await supabase.auth.getUser();

    const s = user.user!.id;
    const { data: u } = await supabase.from("user").select("*").eq("id", s);
    myblocked = u![0]["blocked"];
    newblocked = u![0]["blockedby"]
    const { data: hs } = await supabase.from("user").select("*").eq("handle", slug);
    if (hs && hs.length > 0) {
      if (!newblocked.includes(hs[0]["id"]) && !myblocked.includes(hs[0]["id"])) {
        console.log(myblocked, hs[0]["id"]);
        l = u![0]["following"];
        const h = u![0]["handle"];
        myname = u![0]["name"];
        
        myphoto = u![0]["image"];
        myhandle = u![0]["handle"];
        userbookmarked = u![0]["bookmarks"];
        userliked = u![0]["liked"];
        let ds = [];

        l.push(h);
        const { data, error } = await supabase
          .from("quickies")
          .select("*,user(id,name,handle,image)")
          .eq("handle", slug)
          .order("id", { ascending: false })
          .in("handle", l)
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
      } else {
        empty = true;
        loading = false;
      }
    } else {
      empty = true;
      loading = false;
    }
  }
  await get();

  if (isSupabaseConnected) {
    return (
      <>
        <div className="flex-1 h-screen p-0 overflow-hidden -py-2">
          <div className="p-4 py-0 pb-2 mx-1 md:mx-1">
            <Search page="quickies" text={AppConfig.title} />
          </div>

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
                      <h1 className="mx-auto text-sm text-center text-neutral-400">
                        The user you searched haven&apos;t posted yet or they have blocked you. But fret not! There are
                        several great quickies from other users on the app.
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
              {!empty && (
                <More
                  myblocked={myblocked}
                  handle={slug}
                  myhandle={myhandle}
                  myname={myname}
                  newblocked={newblocked}
                  myphoto={myphoto}
                  userliked={userliked}
                  userbookmarked={userbookmarked}
                  in={l}
                ></More>
              )}{" "}
            </div>{" "}
          </div>
        </div>
      </>
    );
  } else {
    return <></>;
  }
}
