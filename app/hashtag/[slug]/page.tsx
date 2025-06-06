import More from "@/components/MoreHashtags";
import PostComponent from "@/components/QuickieComponent";
import Search from "@/components/SearchComponent";
import { AppConfig } from "@/config/config";
import { createClient } from "@/utils/supabase/server";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
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

  let quote = false;
  let quoteid = "";
  let quotehandle = "";
  let quotename = ""
  let quotedisplay = "";
  let quoteimage :any[] = [];
  let quotephotocount = 0;
  let quotecontent = "";
  let quotetime = "";
  
  let myname = "";
  let myphoto = "";
  let myhandle = "";
  let blocked: any[] = [];
  let newblocked:any[] = [];
  let userliked: any[] = [];
  let userbookmarked: any[] = [];
  let tagarray: any[] = [];

  async function get() {
    const { data: user } = await supabase.auth.getUser();
    const s = user.user!.id;
    const { data: u } = await supabase.from("user").select("*").eq("id", s);
    l = u![0]["following"];
    const h = u![0]["handle"];
    myname = u![0]["name"];
    blocked = u![0]['blocked']
    newblocked = u![0]["blockedby"]
    myphoto = u![0]["image"];
    myhandle = u![0]["handle"];
    userbookmarked = u![0]["bookmarks"];
    userliked = u![0]["liked"];
    const { data: hashtag, error } = await supabase.from("hashtags").select("posts").eq("hashtag", slug);
    let ds = [];

    l.push(h);
    if (!error) {
      if (hashtag[0]) {
        if (hashtag[0]["posts"].length > 0) {
          tagarray = hashtag[0]["posts"];
          const { data, error } = await supabase
            .from("quickies")
            .select("*,user(id,name,handle,image)")
            .order("id", { ascending: false })
            .in("id", hashtag[0]["posts"])
            .not("poster", "in", `(${blocked.toString()})`)
            .not("poster", "in", `(${newblocked.toString()})`)

            .limit(5);
          if (error) {
          } else {
            ds = data;
           for await(const [index, post] of ds.entries()) {
              let liked = false;
              if(ds[index]["quote"]){
                post.quote = true;
            post.quoteid = ds[index]["quoteid"];
            const { data: q } = await supabase.from("quickies").select("*, user (name, handle, id, image)").eq("id", post.quoteid);
            if (q) {
              post.quotehandle = q[0]["user"]["handle"];
              post.quotename = q[0]["user"]["name"];
              post.quotedisplay = q[0]["user"]["image"];
              post.quoteimage = q[0]["image"];
              
              if(post.quoteimage){
                post.quotephotocount = q[0]["image"].length;
              }
              post.quotecontent = q[0]["content"];
              const date2 = new Date(q[0].created_at)
              let d = date2;
              
              post.quotetime = timeAgo.format(Date.now() - (date1.getTime() - date2.getTime()));
            }
              }
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
      } else {
        empty = true;
        loading = false;
      }
    }
  }

  await get();

  if (isSupabaseConnected) {
    return (
      <>
        <div className="overflow-hidden flex-1 p-0 py-2 h-screen">
          <div className="p-4 py-2 mx-1 md:mx-1">
            <Search page="quickies" text={AppConfig.title} />
          </div>
          <div className="overflow-y-scroll h-full hiddenscroll">
            <div className="flex flex-col gap-0 mb-20 animate-in hiddenscroll">
              {!loading ? (
                !empty ? (
                  posts.map((post) => (
                    <PostComponent
                      id={post.id}
                      cover={post.cover}
                      title={post.title}
                      time={timeAgo.format(Date.now() - post.diff)}
                      key={post.id}
                     

quote={post.quote}
quoteid={post.quoteid}
quotehandle={post.quotehandle}
quotename={post.quotename}
quotedisplay={post.quotedisplay}
quoteimage={post.quoteimage}
quotephotocount={post.quotephotocount}
quotecontent={post.quotecontent}
quotetime={post.quotetime}
                      image={post.image}
                      comments={post.comments}
                      userliked={userliked}
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
                  <div className="flex content-center items-center px-10 mt-24 w-full sm:px-24 md:px-16 lg:px-24">
                    <div className="flex flex-col gap-2 mx-auto max-w-max">
                      <h1 className="mx-auto text-lg font-semibold text-center text-white">No Quickies To View!</h1>
                      <h1 className="mx-auto text-sm text-center text-neutral-300">
                        No posts containing such hashtag is found. Explore other quickies?
                      </h1>
                      <Link
                        href="/quickies"
                        className={`mx-auto mt-3 rounded-full w-max px-8 py-3 text-xs font-medium  ${
                          1 == 1 ? "bg-primary-700 text-white" : "border-2 bg-white"
                        }`}
                      >
                        Explore Quickies
                      </Link>
                    </div>
                  </div>
                )
              ) : (
                <div className="flex content-center items-center w-full h-screen"></div>
              )}
              <More
                myhandle={myhandle}
                myname={myname}
                myphoto={myphoto}
                userliked={userliked}
                myblocked={blocked}
                newblocked={newblocked}
                userbookmarked={userbookmarked}
                in={tagarray}
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
