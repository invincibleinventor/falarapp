import More from "@/components/MoreQuickies";
import PostComponent from "@/components/QuickieComponent";
import Search from "@/components/SearchComponent";
import Trending from "@/components/Trending";
import { createClient } from "@/utils/supabase/server";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Index({ params }: { params: { slug: string } }) {
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
  let myhandle = "";
  let userliked :any[] = [];
  let userbookmarked:any[] = [];
  let myblocked = "";
  
  async function get() {
    const { data: user } = await supabase.auth.getUser();
   
    
    const s = user.user!.id;
    const { data: u } = await supabase.from("user").select("*").eq("id", s);
    myblocked = u![0]["blocked"]

    const { data: hs } = await supabase.from("user").select("*").eq("handle", params.slug);
    if(hs && hs.length>0){
      if(!myblocked.includes(hs[0]["id"])){
        console.log(myblocked,hs[0]["id"])
    l = u![0]["following"];
    const h = u![0]["handle"];
    myname = u![0]["name"]
    
    myphoto = u![0]["image"]
    myhandle = u![0]["handle"]
    userbookmarked = u![0]["bookmarks"]
    userliked = u![0]["liked"]
    let ds = [];
    
    l.push(h);
    const { data, error } = await supabase
      .from("quickies")
      .select("*")
      .eq('handle',params.slug)
      .order("id", { ascending: false })
      .in("handle", l)
      .limit(5);
    if (error) {
    } else {
      ds = data;

      for await (const [index, post] of ds.entries()) {
       
        let liked = false;
        const likedlist: string | any[] = ds[index].liked
        let bookmarked = false;
        const bookmarkedlist: any[] = ds[index].bookmarked;
        if(likedlist.includes(myhandle)){
          liked = true
        }
        if(bookmarkedlist.includes(myhandle)){
          bookmarked=true
        }
        
        ds[index].liked=liked
          ds[index].bookmarked=bookmarked
          ds[index].bookmarkedlist=bookmarkedlist
          ds[index].likedlist=likedlist
        const { data } = await supabase.from("user").select("*").eq("id", post.poster);

        if (data) {
          ds[index].name = data[0].name;
          const date2 = new Date(ds[index].created_at);
          ds[index].diff = date1.getTime() - date2.getTime();
          ds[index].dp = data[0].image;
          
        }
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
  else{
    empty = true
    loading = false
  }
}
else{
  empty=true;loading=false
}

}
  await get();


  if (isSupabaseConnected) {
    return (
      <>
        <div className="flex-1 h-screen p-0 py-2 overflow-hidden">
          <div className="p-4 py-2 pb-2 mx-1 md:mx-1">
            <Search page="quickies" text="Falar" />
          </div>
          
          <div className="h-full overflow-y-scroll hiddenscroll">
            <div className="flex flex-col gap-0 mb-20 animate-in hiddenscroll">
              <div className=" lg:hidden">
              <Trending/>

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
                      dp={post.dp}
                      bookmarked={post.bookmarked}
                      liked={post.liked}
                      handle={post.handle}
                      name={post.name}
                      description={post.content}
                    />
                  ))
                ) : (
                  <div className="flex items-center content-center w-full px-10 mt-24 sm:px-24 md:px-16 lg:px-24">
                    <div className="flex flex-col gap-2 mx-auto max-w-max">
                      <h1 className="mx-auto text-lg font-semibold text-center text-gray-300">No Quickies To View!</h1>
                      <h1 className="mx-auto text-sm text-center text-gray-400">
                        The user you searched haven&apos;t posted yet or they have blocked you. But fret not! There are several great quickies from other users on the app.
                      </h1>
                      <Link
                        href="/explore"
                        className={`mx-auto mt-3 rounded-full w-max px-8 py-3 text-xs font-medium  ${
                          1 == 1 ? "bg-cyan-800 text-white" : "border-2 bg-white"
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
              {!empty &&
              <More myblocked={myblocked} handle={params.slug} myhandle={myhandle} myname={myname} myphoto={myphoto} userliked={userliked} userbookmarked={userbookmarked} in={l}></More>
              }{" "}
            </div>{" "}
          </div>
        </div>
      </>
    );
  } else {
    return <></>;
  }
}