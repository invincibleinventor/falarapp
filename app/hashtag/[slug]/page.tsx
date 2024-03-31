import More from "@/components/MoreHashtags";
import PostComponent from "@/components/QuickieComponent";
import Search from "@/components/SearchComponent";
import { createClient } from "@/utils/supabase/server";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Page({ params }: { params: { slug: string } }) {
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
  let tagarray = []

  async function get() {
    const { data: user } = await supabase.auth.getUser();
    const s = user.user!.id;
    const { data: u } = await supabase.from("user").select("*").eq("id", s);
    l = u![0]["following"];
    const h = u![0]["handle"];
    myname = u![0]["name"]
    myphoto = u![0]["image"]
    myhandle = u![0]["handle"]
    userbookmarked = u![0]["bookmarks"]
    userliked = u![0]["liked"]
    const {data:hashtag,error} = await supabase.from('hashtags').select('posts').eq('hashtag',params.slug)
    let ds = [];

    l.push(h);
    if(!error){
    if(hashtag[0]){
        if(hashtag[0]["posts"].length>0){
            tagarray = hashtag[0]["posts"]
    const { data, error } = await supabase
      .from("quickies")
      .select("*")
      .order("id", { ascending: false })
      .in("id",hashtag[0]["posts"])
      .limit(5);
    if (error) {
    } else {
      ds = data;

      for await (const [index, post] of ds.entries()) {
       
        let liked = false;
        let likedlist: string | any[] = ds[index].liked
        let bookmarked = false;
        let bookmarkedlist: any[] = ds[index].bookmarked;
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
  }
  else{
    empty = true
    loading = false
  }
}
}

  await get();

  if (isSupabaseConnected) {
    return (
      <>
        <div className="flex-1 h-screen p-0 py-2 overflow-hidden">
          <div className="p-4 py-2 mx-1 md:mx-1">
            <Search page="quickies" text="Evolt" />
          </div>
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
                      <h1 className="mx-auto text-lg font-semibold text-center text-black">No Quickies To View!</h1>
                      <h1 className="mx-auto text-sm text-center text-gray-800">
                        No posts containing such hashtag is found. Create a new quickie with that hashtag maybe?
                      </h1>
                      <Link
                        href="/quickiemaker"
                        className={`mx-auto mt-3 rounded-md w-max px-8 py-3 text-xs font-bold  ${
                          1 == 1 ? "bg-black text-white" : "border-2 bg-white"
                        }`}
                      >
                        Create Quickie
                      </Link>
                    </div>
                  </div>
                )
              ) : (
                <div className="flex items-center content-center w-full h-screen"></div>
              )}
              <More myhandle={myhandle} myname={myname} myphoto={myphoto} userliked={userliked} userbookmarked={userbookmarked} in={tagarray}></More>{" "}
            </div>{" "}
          </div>
        </div>
      </>
    );
  } else {
    return <></>;
  }
}
