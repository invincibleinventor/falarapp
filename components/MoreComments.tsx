"use client";

import { createClient } from "@/utils/supabase/client";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Oval } from "react-loader-spinner";
import CommentComponent from "./CommentComponent";
export default function CommentsComponent(props: any) {
  const supabase = createClient();
  TimeAgo.locale(en);
  const timeAgo = new TimeAgo("en-US");
  const date1 = new Date();
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any>([]);
  const [offset, setOffset] = useState(1);
  const { ref, inView } = useInView();
  const [halt, setHalt] = useState(false);
  const PAGE_COUNT = 5;
  async function get(from: number, to: number) {
    //alert('reached')
    const { data, error } = await supabase
      .from("comments")
      .select("*,user(name,handle,image)")
      .eq("id", props.slug)
      .order("likes", { ascending: false })
      .not("poster", "in", `(${props.myblocked})`)
      .range(from, to);
    if (error) {
      console.log(error);
    } else {
      if (data && data.length > 0) {
        console.log(data);
        const l = data;
        for await (const [index, comment] of l.entries()) {
          console.log(index, comment);

          const date2 = new Date(l[index].time);
          l[index].newtime = date1.getTime() - date2.getTime();
          if (props.loggedin) {
            if (l[index].liked.includes(props.myhandle)) {
              console.log(props.myhandle, index);
              l[index].likedbyme = true;
            } else {
              l[index].likedbyme = false;
            }
          } else {
            l[index].likedbyme = false;
          }
          console.log(l[index]);
        }
        setComments([...comments, ...l]);
        setLoading(false);
        if (l.length < PAGE_COUNT) {
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
      <div className="flex flex-col my-3 mt-6 space-y-4">
        {!loading
          ? comments.map((comment: any) => (
              <CommentComponent
                time={timeAgo.format(Date.now() - comment.newtime)}
                myhandle={props.myhandle}
                likedbypeople={comment.liked}
                comment_id={comment.comment_id}
                key={comment.comment_id}
                handle={comment.handle}
                likes={comment.likes}
                likedbyme={comment.likedbyme}
                name={comment.user.name}
                profile={comment.user.image}
                content={comment.content}
                loggedin={props.loggedin}
              />
            ))
          : comments &&
            comments.length > 0 && (
              <>
                <Oval
                  height={40}
                  width={40}
                  color="#000000"
                  wrapperStyle={{}}
                  wrapperClass="mx-auto mt-5"
                  visible={!halt ? true : false}
                  ariaLabel="oval-loading"
                  secondaryColor="#808080"
                  strokeWidth={2}
                  strokeWidthSecondary={2}
                />
                <div className={!halt ? "min-h-[1px]" : "hidden"} ref={ref}></div>
              </>
            )}
      </div>
    </>
  );
}
