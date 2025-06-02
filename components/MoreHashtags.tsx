"use client";
import { createClient } from "@/utils/supabase/client";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Oval } from "react-loader-spinner";
import QuickieComponent from "./QuickieComponent";
export default function More(props: any) {
  const supabase = createClient();
  const [offset, setOffset] = useState(1);
  const { ref, inView } = useInView();
  const [halt, setHalt] = useState(false);
  const [posts, setPosts] = useState<any>([]);
  const [quote,setQuote] = useState<boolean>(false);
  const [quoteid,setQuoteid] = useState<string>("");
  const [quotehandle,setQuotehandle] = useState<string>("");
  const [quotename,setQuotename] = useState<string>("");
  const [quotedisplay,setQuotedisplay] = useState<string>("");
  const [quoteimage,setQuoteimage] = useState<any[]>([]);
  const [quotephotocount,setQuotephotocount] = useState<number>(0);
  const [quotecontent,setQuotecontent] = useState<string>("");
  const [quotetime,setQuotetime] = useState<string>("");


  TimeAgo.locale(en);
  const PAGE_COUNT = 5;
  const timeAgo = new TimeAgo("en-US");
  const date1 = new Date();

  async function get(from: number, to: number) {
    if (props.handle) {
      const { data, error } = await supabase
        .from("quickies")
        .select("*,user(id,name,handle,image)")
        .eq("handle", props.handle)
        .order("id", { ascending: false })
        .range(from, to);
      if (error) {
        console.log(error);
      } else {
        if (data && data.length > 0) {
          console.log(data);
          const ds = data;
          

          for await (const [index, post] of ds.entries()) {
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
            
            post.quotetime = d.toLocaleTimeString().replace(/:\d+ /, ' ') + "  •  " + date2.toDateString().replace(/^\S+\s/,'');
          }
            }
            let liked = false;
            const likedlist: string | any[] = ds[index].liked;
            let bookmarked = false;
            const bookmarkedlist: any[] = ds[index].bookmarked;
            if (likedlist.includes(props.myhandle)) {
              liked = true;
            }
            if (bookmarkedlist.includes(props.myhandle)) {
              bookmarked = true;
            }

            ds[index].liked = liked;
            ds[index].bookmarked = bookmarked;
            ds[index].bookmarkedlist = bookmarkedlist;
            ds[index].likedlist = likedlist;
            console.log(likedlist);

            const date2 = new Date(ds[index].created_at);
            ds[index].diff = date1.getTime() - date2.getTime();
          }
          setPosts((prev: any) => [...prev, ...ds]);
          if (ds.length < PAGE_COUNT) {
            setHalt(true);
          }
        } else {
          setHalt(true);
        }
      }
    } else {
      const { data, error } = await supabase
        .from("quickies")
        .select("*,user(id,name,handle,image)")
        .not("poster", "in", `(${props.myblocked.toString()})`)

        .not("poster", "in", `(${props.newblocked.toString()})`)
        .in("id", props.in)
        .order("id", { ascending: false })
        .range(from, to);
      if (error) {
        console.log(error);
      } else {
        if (data && data.length > 0) {
          console.log(data);
          const ds = data;
  
          for await (const [index, post] of ds.entries()) {
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
            
            post.quotetime = d.toLocaleTimeString().replace(/:\d+ /, ' ') + "  •  " + date2.toDateString().replace(/^\S+\s/,'');
          }
            }
            let liked = false;
            const likedlist: string | any[] = ds[index].liked;
            let bookmarked = false;
            const bookmarkedlist: any[] = ds[index].bookmarked;
            if (likedlist.includes(props.myhandle)) {
              liked = true;
            }
            if (bookmarkedlist.includes(props.myhandle)) {
              bookmarked = true;
            }

            ds[index].liked = liked;
            ds[index].bookmarked = bookmarked;
            ds[index].bookmarkedlist = bookmarkedlist;
            ds[index].likedlist = likedlist;
            console.log(likedlist);

            const date2 = new Date(ds[index].created_at);
            ds[index].diff = date1.getTime() - date2.getTime();
          }
          setPosts([...posts, ...ds]);
          if (ds.length < PAGE_COUNT) {
            setHalt(true);
          }
        } else {
          setHalt(true);
        }
      }
    }
  }
  useEffect(() => {
    if (!halt && inView) {
      setOffset((prev) => prev + 1);

      const from = offset * PAGE_COUNT;
      const to = from + PAGE_COUNT - 1;

      get(from, to);
    }
  }, [inView]);
  return (
    <>
      <div className="flex flex-col gap-2 content-center items-center pb-20 w-full">
        {posts.map((post: any) => (
          <QuickieComponent
            id={post.id}
            cover={post.cover}
           

quote={post.quote}
quoteid={post.quoteid}
quotehandle={post.quotehandle}
quotename={post.quotename}
quotedisplay={post.quotedisplay}
quoteimage={post.quoteimage}
quotephotocount={post.quotephotocount}
quotecontent={post.quotecontent}
quotetime={post.quotetime}
            title={post.title}
            time={timeAgo.format(Date.now() - post.diff)}
            key={post.id}
            image={post.image}
            userliked={props.userliked}
            userbookmarked={props.userbookmarked}
            bookmarkedlist={post.bookmarkedlist}
            likedlist={post.likedlist}
            myhandle={props.myhandle}
            dp={post.user.image}
            bookmarked={post.bookmarked}
            liked={post.liked}
            handle={post.handle}
            name={post.user.name}
            comments={post.comments}
            description={post.content}
          />
        ))}        <div className={!halt ? "min-h-[1px]" : "hidden"} ref={ref}></div>

        <Oval
          height={80}
          width={80}
          color="#000000"
          wrapperStyle={{}}
          wrapperClass="mx-auto mt-5"
          visible={!halt ? true : false}
          ariaLabel="oval-loading"
          secondaryColor="#808080"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </div>
    </>
  );
}
