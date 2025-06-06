"use client";
import { createClient } from "@/utils/supabase/client";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Oval } from "react-loader-spinner";
import PostComponent from "./PostComponent";
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
    const { data, error } = await supabase
      .from("posts")
      .select("*,user(id,name,handle,image)")
      .order("id", { ascending: false })
      .in("id", props.l)
      .range(from, to)
      .not("poster", "in", `(${props.myblocked.toString()})`)
      .not("poster", "in", `(${props.newblocked.toString()})`);
    if (error) {
      console.log(error);
    } else {
      if (data && data.length > 0) {
        const ds = data;
        for await (const [index, post] of ds.entries()) {
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
      <div className="flex flex-col gap-2 content-center items-center pb-20">
        {posts.map((post: any) => (
          <PostComponent
            id={post.id}
            type="profile"
            title={post.title}
            cover={post.cover}
            time={timeAgo.format(Date.now() - post.diff)}
            key={post.id}
            image={post.image}
            likes={post.likes}
            dp={post.user.image}
            handle={post.handle}
            name={post.user.name}
            description={post.excerpt}
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
