import More from "@/components/More";
import PostComponent from "@/components/PostComponent";
import { createClient } from "@/utils/supabase/server";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { cookies } from "next/headers";
import Link from "next/link";
export default async function Index() {
  let loggedin = false;
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
  let newblocked :any [] = []
  let myblocked: any[] = [];
  let l: any[] = [];
  async function get() {
    const { data: user } = await supabase.auth.getUser();
    let s:any;
    if(user.user){
      s = user.user.id;
      loggedin = true;
    }
    const { data: u } = await supabase.from("user").select("*").eq("id", s);
    l = u![0]["following"];
    myblocked = u![0]["blocked"];
    newblocked = u![0]["blockedby"]
    const h = u![0]["handle"];
    let ds = [];

    l.push(h);
    const { data, error } = await supabase
      .from("posts")
      .select("*,user(id,name,handle,image)")
      .order("id", { ascending: false })
      .in("handle", l)
      .not("poster", "in", `(${myblocked.toString()})`)
      .not("poster", "in", `(${newblocked.toString()})`)
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
                    handle={post.handle}
                    likes={post.likes}
                    userid={post.user.id}
                    name={post.user.name}
                    description={post.excerpt}
                  />
                ))
              ) : (
                <div className="flex items-center content-center w-full px-10 mt-24 sm:px-24 md:px-16 lg:px-24">
                  <div className="flex flex-col gap-2 mx-auto max-w-max">
                    <h1 className="mx-auto text-lg font-semibold text-center text-neutral-300">No Posts To View!</h1>
                    <h1 className="mx-auto text-sm text-center text-neutral-400">
                      Follow people to view their posts on your home feed. The more people you follow, the more posts on
                      your feed
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
            <More newblocked={newblocked} myblocked={myblocked} in={l}></More>{" "}
          </div>{" "}
        </div>
      </>
    );
  } else {
    return <></>;
  }
}
