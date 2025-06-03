"use client";
import More from "@/components/MoreQuickies";
import PostComponent from "@/components/QuickieComponent";
import Search from "@/components/SearchComponent";
import { createClient } from "@/utils/supabase/client";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import Link from "next/link";
import { use, useEffect, useState } from "react";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const {slug } = use(params)
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

  const timeAgo = new TimeAgo("en-US");
  const date1 = new Date();
  const [blocked, setBlocked] = useState<any>([]);
  const isSupabaseConnected = canInitSupabaseClient();
  const [empty, setEmpty] = useState(false);
  const [quote,setQuote] = useState<boolean>(false);
  const [quoteid,setQuoteid] = useState<string>("");
  const [quotehandle,setQuotehandle] = useState<string>("");
  const [quotename,setQuotename] = useState<string>("");
  const [quotedisplay,setQuotedisplay] = useState<string>("");
  const [quoteimage,setQuoteimage] = useState<any[]>([]);
  const [quotephotocount,setQuotephotocount] = useState<number>(0);
  const [quotecontent,setQuotecontent] = useState<string>("");
  const [quotetime,setQuotetime] = useState<string>("");

  const [posts, setPosts] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [l, setL] = useState([]);
  const [myname, setMyname] = useState("");
  const [myphoto, setMyphoto] = useState("");
  const [myhandle, setMyhandle] = useState("");
  const [userliked, setUserliked] = useState([]);
  const [search, setSearch] = useState(slug);
  const [tempsearch, setTempSearch] = useState("");
const [newblocked,setnewblocked] = useState([])
  const [userbookmarked, setUserBookmarked] = useState([]);
  useEffect(() => {
    async function get() {
      const { data: user } = await supabase.auth.getUser();
      const s = user.user!.id;
      const { data: u } = await supabase.from("user").select("*").eq("id", s);
      setL(u![0]["following"]);
      const h = u![0]["handle"];
      setMyname(u![0]["name"]);
      setMyphoto(u![0]["image"]);
      setMyhandle(u![0]["handle"]);
      setUserBookmarked(u![0]["quickiebookmarks"]);
      setUserliked(u![0]["quickieliked"]);
      setBlocked(u![0]["blocked"]);
      setnewblocked(u![0]["blockedby"])
      let ds = [];
      const a: any = l;
      a.push(h);
      setL(a);
      const { data, error } = await supabase
        .from("quickies")
        .select("*,user(id,name,handle,image)")
        .order("id", { ascending: false })
        .not("poster", "in", `(${u![0]["blocked"].toString()})`)
        .not("poster", "in", `(${u![0]["blockedby"].toString()})`)

        .textSearch("content", `'${search}' | '${search.toLowerCase()}' | '${search.toUpperCase()}'`)

        .limit(5);
      if (error) {
      } else {
        ds = data;
       
        for await (const [index, post] of ds.entries()) {
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
          
          if(ds[index].to>0){
            const { data } = await supabase.from("quickies").select(`*, 
              user (
              
                handle
              
              )`).eq("id", post.to);
            ds[index].parentid = ds[index].to;

            if(data && data?.length>0){
              ds[index].parentname = data[0].user.handle;
            }
        
          }
          ds[index].liked = liked;
          ds[index].bookmarked = bookmarked;
          ds[index].bookmarkedlist = bookmarkedlist;
          ds[index].likedlist = likedlist;

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
      }
    }
    get();
  }, [search]);

  if (isSupabaseConnected) {
    return (
      <>
        <div className="overflow-hidden flex-1 p-0 py-2 h-screen">
          <div className="p-4 py-2 mx-1 md:mx-1">
          <Search text="Quickies" page="quickies" search={search.replaceAll("%20",' ')} />

          </div>
          <div className="overflow-y-scroll h-full hiddenscroll">
            <div className="flex flex-col gap-0 mb-20 animate-in hiddenscroll">
              {!loading ? (
                !empty ? (
                  posts.map((post: any) => (
                    <PostComponent
                      id={post.id}
                      cover={post.cover}
                      title={post.title}
                      time={timeAgo.format(Date.now() - post.diff)}
                      key={post.id}
                      image={post.image}
                      highlight={search}
                      parentid={post.parentid}
                      parentname={post.parentname}
                      comments={post.comments}
                      userliked={userliked}
                      userbookmarked={userbookmarked}
                      bookmarkedlist={post.bookmarkedlist}
                      likedlist={post.likedlist}
                      myhandle={myhandle}
                      userid={post.user.id}
                      

quote={post.quote}
quoteid={post.quoteid}
quotehandle={post.quotehandle}
quotename={post.quotename}
quotedisplay={post.quotedisplay}
quoteimage={post.quoteimage}
quotephotocount={post.quotephotocount}
quotecontent={post.quotecontent}
quotetime={post.quotetime}
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
                      <h1 className="mx-auto text-lg font-semibold text-center text-neutral-300">No Quickies To View!</h1>
                      <h1 className="mx-auto text-sm text-center text-neutral-600">
                        There are no quickies that match your search. Maybe try exploring other quickies?
                      </h1>
                      <Link
                        href="/quickies/all"
                        className={`mx-auto mt-3 rounded-full w-max px-8 py-3 text-xs font-medium  ${
                          1 == 1 ? "bg-primary-800 text-white" : "border-2 bg-white"
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
                myblocked={blocked}
                slug={search}
                myhandle={myhandle}
                newblocked={newblocked}
                myname={myname}
                myphoto={myphoto}
                userliked={userliked}
                userbookmarked={userbookmarked}
                in={l}
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
