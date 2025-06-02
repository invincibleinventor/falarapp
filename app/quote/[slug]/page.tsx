/* eslint-disable react/jsx-key */

import { createClient } from "@/utils/supabase/server";
import TimeAgo from "javascript-time-ago";
import {cache} from "react";
import en from "javascript-time-ago/locale/en";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import Iof from "@/components/Iof";
import Back from "@/components/back";
import QuickieMakerComponent from "@/components/quickiereply";
export default async function App({ params }: { params: Promise<{ slug: string }>}) {
  const cookieStore =  cookies();
  const slug = (await params).slug;
  const supabase = createClient(cookieStore);
  let author = "";
  let content = "";
  let mentionarray: any[] = [];
  const timeStamp = new Date().getTime();
  let image: any[] = [];
  let profile = "";
  let error = false;
  let naam = "";
  let time = 0;
  let loading = false;
  let parentQuickie: any;
  let myname = "";
  let myphoto = "";
  let myid= "";
  let newblocked :any[] = [];
  let createdat:any;
  let myhandle = "";
  let loggedin = false;
  let liked = false;
  let photocount = 0;
  let likedlist: string | [] = [];
  let bookmarked = false;
  let bookmarkedlist: any[] = [];
  let userliked: any[] = [];
  let blocked: any[] = [];
  let userbookmarked: any[] = [];
  let comments: any[] = [];
  TimeAgo.locale(en);
  let authorid;
  let user = "";
  const timeAgo = new TimeAgo("en-US");
  const date1 = new Date();

 const set = cache(async () => {
    
    const { data: u } = await supabase.auth.getUser();
    if (u.user) {
      user = u.user.id;

      loggedin = true;
      const { data: users } = await supabase.from("user").select("*").eq("id", user);
      if (users) {
        myphoto = users[0]["image"];
        blocked = users[0]["blocked"];
        newblocked = users[0]["blockedby"]
        myname = users[0]["name"];
        myhandle = users[0]["handle"];
        myid = user;
        userliked = users[0]["liked"];
        userbookmarked = users[0]["bookmarks"];
      }
    }
    const blockedpostgres = blocked.toString();
    const { data, error: e } = await supabase.from("quickies").select("*").eq("id", slug);
    if (data && data.length > 0) {
      error = false;
    mentionarray = data[0]["involved"];
      const l = data[0]["liked"];
      if (l.includes(myhandle)) {
        liked = true;
      }
      likedlist = l;
      const x = data[0]["bookmarked"];
      if (data[0].to && data[0].to !== 0) {
        const { data: parent } = await supabase.from("quickies").select("*, user (name, handle, id, image)").eq("id", data[0].to);
        if (parent && parent.length > 0) {
          parentQuickie = parent[0];
        }
      }
      if (x.includes(myhandle)) {
        bookmarked = true;
      }
      bookmarkedlist = x;
      const { data: u } = await supabase.from("user").select("*").eq("id", data[0]["poster"]);
      if (u) {
        author = u[0]["handle"];

        naam = u[0].name;
        authorid = u[0].id;
        profile = u[0].image;
        content = data[0]["content"];
        image = data[0]["image"];
        if (image) {
          photocount = data[0]["image"].length;
        }
      }
      const date2 = new Date(data[0].created_at)
      let d = date2;
      createdat = d.toLocaleTimeString().replace(/:\d+ /, ' ') + "  •  " + date2.toDateString().replace(/^\S+\s/,'');
      time = date1.getTime() - date2.getTime();
      loading = false;
    } else if (e || data.length == 0) {
      error = true;
      loading = false;
    }
  }
 )
  await set();


    async function getReplies() {
      const { data: replies } = await supabase
        .from("quickies")
        .select("*, user (name, handle, id, image)")
        .eq("to", slug)
        .not("poster", "in", `(${blocked.length > 0 ? blocked.toString() : '""'})`)
        .not("poster", "in", `(${newblocked.length > 0 ? newblocked.toString() : '""'})`)
        .order("id", { ascending: false })
        .limit(5);

  
      if (!replies) return [];
  
      return replies.map((r) => {
        const createdDate = new Date(r.created_at);
        r.time = timeAgo.format(Date.now() - (date1.getTime() - createdDate.getTime()));
        r.likedlist = r.liked

        r.liked = r.liked.includes(myhandle);
        r.bookmarkedlist = r.bookmarked
        r.bookmarked = r.bookmarked.includes(myhandle);
        return r;
      });
    }
  
     comments = await getReplies();
 
     const formatText = (text: string) => {
      // Split by spaces and mentions/hashtags/URLs as separate tokens
      const tokens = text.split(/(\s+|(?:#|@)[a-zA-Z][\w]*|https?:\/\/[^\s]+)/);
    
      return tokens.map((token, idx) => {
        if (!token || token.trim() === '') {
          // Preserve whitespace as is
          return token;
        }
    
        // Hashtag: starts with # and next char is a letter
        if (/^#[a-zA-Z][\w]*$/.test(token)) {
          const hashtag = token.slice(1);
          return (
            <Link legacyBehavior href={`/hashtag/${hashtag}`} key={idx}>
              <a className="text-primary-600 hover:text-primary-700">{token}</a>
            </Link>
          );
        }
    
        // Mention: starts with @ and next char is a letter
        if (/^@[a-zA-Z][\w]*$/.test(token)) {
          const username = token.slice(1);
          return (
            <Link legacyBehavior href={`/profile/${username}`} key={idx}>
              <a className="text-primary-600 hover:text-primary-700">{token}</a>
            </Link>
          );
        }
    
        // URL
        if (/^https?:\/\/[^\s]+$/.test(token)) {
          return (
            <a target="_blank" href={token} className="text-primary-600 hover:text-primary-700" key={idx} rel="noreferrer">
              {token}
            </a>
          );
        }
    
        // Plain text or ignored patterns (like #7worlds or @3chan)
        return token;
      });
    };
  console.log("here");
  console.log(comments);
  console.log("above");
  return !loading ? (
    <div className="flex overflow-hidden relative flex-col flex-1 h-screen bg-transparent">
     
      {(error || blocked.includes(authorid)) && (
        <div className="flex content-center items-center px-10 w-full h-screen sm:px-24 md:px-16 lg:px-24">
          <div className="flex flex-col gap-4 mx-auto max-w-max">
            <h1 className="mx-auto text-lg font-semibold text-center text-neutral-300">That Quickie Doesn&apos;t Exist</h1>
            <h1 className="mx-auto text-center text-neutral-400 text-md">
              That quickie does not exist. It must have been removed or deleted by the author. Please refresh if you
              think that is not the case
            </h1>
            <Link
              href="/quickies"
              className={`mx-auto mt-3 w-max rounded-full px-8 py-3 text-xs font-bold ${
                1 == 1 ? "bg-primary-800 text-white" : "border-2  bg-white "
              }`}
            >
              Return Back
            </Link>
          </div>
        </div>
      )}
      {!error && !newblocked.includes(authorid) && !blocked.includes(authorid) && (
        <div className="hiddenscroll h-full w-[calc(100vw-68px)] mx-0 overflow-hidden pb-14 md:w-full md:max-w-full px-0">
                        <div className="flex  z-[1000000] shadow-lg fixed flex-row content-center items-center px-4 py-4 space-x-4 w-full text-white border-b bg-primary-950 border-b-primary-950">
                          <Back></Back>
                          <h1 className="text-lg font-medium text-white font-poppins">
                            
                            Quoted Quickie
                            </h1>
                        </div>

          <div className="w-full pt-[61px] lg:pr-2 px-2 py-[6px] pb-0">
            <div className="flex flex-col rounded-none md:gap-0">
              <Link href={"/quickie/"+slug} className="flex h-max shadow-xl border border-neutral-900 pb-4 mb-2 bg-black bg-opacity-10  rounded-2xl mx-4  flex-col gap-[8px] pt-4 mt-4 ">
             
                <div className="flex flex-row gap-2 content-center items-center h-max shrink-0">
                  <div className="flex gap-[10px] px-4 mt-0">
                    <Image
                    width={20}
                    height={20}
                      src={profile}
                      alt="user profile"
                      className="rounded-md object-cover min-w-[28px] max-w-[28px] h-7"
                    />
                    <div className="flex content-center items-center">
                      <h1>
                        <p className="text-sm font-medium break-all text-neutral-300 line-clamp-1">{naam}</p>
                      </h1>
                      <div className="mx-1 text-sm text-neutral-400">·</div>
                      <span className="text-sm font-medium whitespace-nowrap text-neutral-400">@{author}</span>
                    </div>
                  </div>
                  <h1 className="px-4 ml-auto w-max text-sm font-medium text-neutral-400">{createdat}</h1>

                </div>

                <div >
                  <h1
                    style={{ wordBreak: "break-word", whiteSpace: "normal" }}
                    className="px-4 mt-1 text-sm font-medium text-neutral-300 four-line-ellipsis md:text-base"
                  >
                    {formatText(content)}
                  </h1>


                  {photocount > 0 && (
                    <div
                      className={
                        photocount == 1
                          ? "w-full px-4 border ml-0 rounded-md mt-4 aspect-video h-full"
                          : photocount == 3
                            ? "mt-4 px-4  md:gap-2 gap-1 grid thrip"
                            : "mt-4 px-4 md:gap-2 gap-1 grid-cols-2 grid"
                      }
                    >
                      {image.map((image: string) => (
                        <Iof key={image} length={photocount} src={image} />
                      ))}
                    </div>
                  )}


               
                </div>
              </Link>
            </div>
           
          </div>
          {loggedin && !newblocked.includes(authorid) && !blocked.includes(authorid)  && (
            <section className="px-0 pt-4 lg:pr-0" id="comments">
              <QuickieMakerComponent quoteid={slug} quote={true} quoteauthor={author} image={myphoto} myid={myid} myhandle={myhandle} handle={author} mentionarray={mentionarray} to={slug} />
       
           
            </section>
          )}
        </div>
      )}
      
      
    </div>
  ) : (
    <div className="flex content-center items-center w-full h-screen"></div>
  );

}
