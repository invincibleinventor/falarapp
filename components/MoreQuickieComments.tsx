"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useInView } from "react-intersection-observer";
import CommentComponent from "./QuickieCommentsComponent";
import { Oval } from "react-loader-spinner";

export default function MoreQuickieComments(props: any) {
  const supabase = createClient();
  TimeAgo.addLocale(en);
  const timeAgo = new TimeAgo("en-US");
  const date1 = new Date();
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any[]>([]);
  const [offset, setOffset] = useState(1);
  const { ref, inView } = useInView();
  const [halt, setHalt] = useState(false);
  const PAGE_COUNT = 5;

  async function get(from: number, to: number) {
    const { data, error } = await supabase
      .from("quickiecomments")
      .select("*,user(id,name,handle,image)")
      .eq("id", props.slug)
      .order("likes", { ascending: false })
      .not("poster", "in", `(${props.myblocked.toString()})`)
      .not("poster", "in", `(${props.newblocked.toString()})`)
      .range(from, to);

    if (error) {
      console.log(error);
    } else {
      if (data && data.length > 0) {
        const l = data;
        for await (const [index, comment] of l.entries()) {
          const date2 = new Date(l[index].time);
          l[index].newtime = date1.getTime() - date2.getTime();
          if (props.loggedin) {
            l[index].likedbyme = l[index].liked.includes(props.myhandle);
          } else {
            l[index].likedbyme = false;
          }
        }
        setComments((prevComments) => [...prevComments, ...l]);
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
      const from = offset * PAGE_COUNT;
      const to = from + PAGE_COUNT - 1;
      get(from, to);
      setOffset((prev) => prev + 1);
    }
  }, [inView]);

  return (
    <div className="flex flex-col pb-20 ">
      {comments.map((comment: any) => (
        <CommentComponent
          time={timeAgo.format(Date.now() - comment.newtime)}
          myhandle={props.myhandle}
          likedbypeople={comment.liked}
          comment_id={comment.comment_id}
          key={comment.comment_id}
          handle={comment.handle}
          postid={props.slug}
          userid={comment.user.id}
          stateChanger={props.setState}
          likes={comment.likes}
          likedbyme={comment.likedbyme}
          name={comment.user.name}
          profile={comment.user.image}
          content={comment.content}
          loggedin={props.loggedin}
        />
      ))}
      <div className={!halt ? "min-h-[1px]" : "hidden"} ref={ref}></div>

      <Oval
        height={80}
        width={80}
        color="#000000"
        wrapperClass="mx-auto"
        visible={!halt ? true : false}
        ariaLabel="loading-indicator"
        secondaryColor="#808080"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  );
}
