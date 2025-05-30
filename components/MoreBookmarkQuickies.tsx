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

  TimeAgo.locale(en);
  const PAGE_COUNT = 5;
  const timeAgo = new TimeAgo("en-US");
  const date1 = new Date();

  async function get(from: number, to: number) {
   if(props.slug){
      const { data, error } = await supabase
        .from("quickies")
        .select("*, user(id,name,image,handle)")
        .order("id", { ascending: false })
        .not("poster", "in", `(${props.newblocked.toString()})`)
        .in("id", props.in)
        .textSearch("content", `'${props.slug}' | '${props.slug.toLowerCase()}' | '${props.slug.toUpperCase()}'`)

        .not("poster", "in", `(${props.myblocked.toString()})`)
        .range(from, to);
      if (error) {
        console.log(error);
      } else {
        if (data && data.length > 0) {
          console.log(data);
          const ds = data;
          for await (const [index, post] of ds.entries()) {
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
    else{
      const { data, error } = await supabase
        .from("quickies")
        .select("*, user(id,name,image,handle)")
        .order("id", { ascending: false })
        .not("poster", "in", `(${props.newblocked.toString()})`)
        .in("id", props.in)
        .not("poster", "in", `(${props.myblocked.toString()})`)
        .range(from, to);
      if (error) {
        console.log(error);
      } else {
        if (data && data.length > 0) {
          console.log(data);
          const ds = data;
          for await (const [index, post] of ds.entries()) {
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
      <div className="flex flex-col items-center content-center w-full gap-0 pb-20">
        {posts.map((post: any) => (
          <QuickieComponent
            id={post.id}
            cover={post.cover}
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
            userid={post.user.id}

            name={post.user.name}
            comments={post.comments}
            description={post.content}
          />
        ))}
        <div className={!halt ? "min-h-[1px]" : "hidden"} ref={ref}></div>

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
