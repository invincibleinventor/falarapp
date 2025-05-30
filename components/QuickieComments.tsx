"use client";

import { createClient } from "@/utils/supabase/client";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Oval } from "react-loader-spinner";
import CommentComponent from "./QuickieCommentsComponent";
import MoreComments from "./MoreQuickieComments";
export default function CommentsComponent(props: any) {
  TimeAgo.locale(en);
  const timeAgo = new TimeAgo("en-US");
  const date1 = new Date();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any>();
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement | any>(null);
  const [commentChange, setCommentChange] = useState(false);
  const [state, setState] = useState("");

  const [posted, setPosted] = useState(false);
  async function post() {
    const { error } = await supabase
      .from("quickiecomments")
      .insert({ content: text, id: props.slug, handle: props.myhandle });
    const { data: comments } = await supabase.from("quickies").select("comments").eq("id", props.slug);
    if (comments) {
      const { error: e } = await supabase
        .from("quickies")
        .update({ comments: comments[0]["comments"] + 1 })
        .eq("id", props.slug);

      if (error || e) {
        if (error) {
          console.log(error.message);
        } else if (e) {
          console.log(e.message);
        }
      } else {
        setPosted(true);
        inputRef.current!.value = "";
        setCommentChange(true);
      }
    }
  }
  useEffect(() => {
    async function fetchcomments() {
      const { data, error } = await supabase
        .from("quickiecomments")
        .select("*,user(id,name,handle,image)")
        .eq("id", props.slug)
        .order("likes", { ascending: false })
        .not("poster", "in", `(${props.myblocked.toString()})`)
        .not("poster", "in", `(${props.newblocked.toString()})`)
        .limit(5);
      if (data && data.length != 0) {
        let l = [];
        l = data;
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
        setComments(l);
        setLoading(false);
      } else if (!data || data.length == 0) {
        setComments([]);
        setLoading(false);
      } else {
        setLoading(false);
        console.log(error);
      }
    }
    fetchcomments();
  }, [commentChange]);
  return (
    <>
      {props.loggedin && (
         <div className="sticky  z-[100000] top-0 shadow-lg flex flex-col pt-6 pb-6 space-y-2">
         <h1 className="sticky top-0 px-6 mb-4 text-lg font-bold text-neutral-300">Comments</h1>

<div className="flex flex-row px-6 pt-2 pb-0 space-x-0">
            <Image alt={""} src={props.myphoto} width={32} height={32} className="w-7 h-7 rounded-md shrink-0" />
            <textarea
              required
              minLength={5}
              maxLength={100}
              onKeyDown={(e) => {
                if (e.key === "Enter") post();
              }}
              onChange={(e) => (setState(e.target.value), setText(e.target.value))}
              ref={inputRef}
              value={state}
              className="w-full px-6  pt-[2px] pl-4 mb-0 text-sm font-medium text-neutral-300 bg-transparent outline-none resize-none placeholder:font-medium md:text-base h-max text-md"
              placeholder={"Post a comment publicly as " + props.myname}
            ></textarea>
                        <button onClick={()=>post()} className="px-6 py-2 text-sm text-white rounded-full transition-all duration-100 ease-linear bg-neutral-900 hover:bg-neutral-800 h-max">Post</button>

          </div>
          <div className={!posted ? "hidden" : "pb-6 mx-auto text-xs text-neutral-300"}>
            <h1>Posted</h1>
          </div>
        </div>
      )}
      <div className="flex flex-col px-0 mb-3">
        {!loading ? (
          <>
            {comments.map((comment: any) => (
              <CommentComponent
                time={timeAgo.format(Date.now() - comment.newtime)}
                myhandle={props.myhandle}
                likedbypeople={comment.liked}
                stateChanger={setState}
                comment_id={comment.comment_id}
                key={comment.comment_id}
                userid={comment.user.id}
                likes={comment.likes}
                likedbyme={comment.likedbyme}
                postid={props.slug}
                name={comment.user.name}
                handle={comment.handle}
                profile={comment.user.image}
                content={comment.content}
                loggedin={props.loggedin}
              />
            ))}
            <MoreComments setState={setState} myhandle={props.myhandle} myblocked={props.myblocked} newblocked={props.newblocked} loggedin={props.loggedin} slug={props.slug} />
          </>
        ) : (
          
            <Oval
              height={40}
              width={40}
              color="#000000"
              wrapperStyle={{}}
              wrapperClass="mx-auto mt-5"
              visible={loading ? true : false}
              ariaLabel="oval-loading"
              secondaryColor="#808080"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          
        )}
      </div>
    </>
  );
}
