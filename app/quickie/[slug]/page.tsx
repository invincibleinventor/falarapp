/* eslint-disable react/jsx-key */
import BookMarksComponent from "@/components/QuickieBookMarksComponent";
import CommentsComponent from "@/components/QuickieComments";
import LikeComponent from "@/components/QuickieExpandedLikeComponent";
import { createClient } from "@/utils/supabase/server";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import Iof from "@/components/Iof";
import Menu from "@/components/Menu";
import { AppConfig } from "@/config/config";
export default async function App({ params }: { params: Promise<{ slug: string }>}) {
  const cookieStore =  cookies();
  const slug = (await params).slug;
  const supabase = createClient(cookieStore);
  let author = "";
  let content = "";
  const timeStamp = new Date().getTime();
  let image: any[] = [];
  let profile = "";
  let error = false;
  let naam = "";
  let time = 0;
  let loading = false;
  let myname = "";
  let myphoto = "";
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

  async function set() {
    const { data: u } = await supabase.auth.getSession();
    if (u.session) {
      user = u.session.user.id;

      loggedin = true;
      const { data: users } = await supabase.from("user").select("*").eq("id", user);
      if (users) {
        myphoto = users[0]["image"];
        blocked = users[0]["blocked"];
        newblocked = users[0]["blockedby"]
        myname = users[0]["name"];
        myhandle = users[0]["handle"];
        userliked = users[0]["liked"];
        userbookmarked = users[0]["bookmarks"];
      }
    }
    const blockedpostgres = blocked.toString();
    const { data, error: e } = await supabase.from("quickies").select("*").eq("id", slug);
    if (data && data.length > 0) {
      error = false;
      const l = data[0]["liked"];
      if (l.includes(myhandle)) {
        liked = true;
      }
      likedlist = l;
      const x = data[0]["bookmarked"];
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

  await set();

  async function fetchcomments() {
    const { data, error } = await supabase
      .from("quickiecomments")
      .select("*")
      .eq("id", slug)
      .order("likes", { ascending: false });
    if (data && data.length != 0) {
      comments = data;
      for await (const [index, comment] of comments.entries()) {
        console.log(index, comment);
        const { data } = await supabase.from("user").select("*").eq("id", comment.poster);
        if (data) {
          comments[index].name = data[0]["name"];
          comments[index].profile = data[0]["image"];

          if (loggedin) {
            if (comments[index].liked.includes(myhandle)) {
              console.log(myhandle, index);
              comments[index].likedbyme = true;
            } else {
              comments[index].likedbyme = false;
            }
          } else {
            comments[index].likedbyme = false;
          }
          console.log(comments[index]);
        } else {
          comments.splice(index, 1);
        }
      }
    } else if (!data || data.length == 0) {
      comments = [];
    } else {
      console.log(error);
    }
  }
  await fetchcomments();

  const formatText = (text: string) => {
    console.log("text", text);
    const content = text.split(/((?:#|@|https?:\/\/[^\s]+)[a-zA-Z]+)/);
    let hashtag;
    let username;
    return content.map((word) => {
      if (word.startsWith("#")) {
        hashtag = word.replace("#", "");
        return (
          <Link legacyBehavior href={`/hashtag/${hashtag}`}>
            <a className="text-primary-600 hover:text-primary-700">{word}</a>
          </Link>
        );
      } else if (word.startsWith("@")) {
        username = word.replace("@", "");
        return (
          <Link legacyBehavior href={`/profile/${username}`}>
            <a className="text-primary-600 hover:text-primary-700">{word}</a>
          </Link>
        );
      } else if (word.includes("http")) {
        return (
          <a target="_blank" href={word} className="text-primary-600 hover:text-primary-700">
            {word}
          </a>
        );
      } else {
        return word;
      }
    });
  };
  console.log("here");
  console.log(comments);
  console.log("above");
  return !loading ? (
    <div className="relative flex flex-col flex-1 h-screen overflow-hidden bg-transparent ">
        {!loggedin &&
      
      <div className="flex flex-row items-center content-center justify-between w-full px-6 py-4 space-y-1 bg-blue-600 md:border-x md:border-x-neutral-900">
        <h1 className="text-sm font-semibold text-white">Sign up to Falar to view more such interesting quickies</h1>
        <Link href={('/login')} className="px-6 py-2 text-xs font-semibold text-blue-600 transition-all duration-200 ease-linear bg-white rounded-full hover:bg-neutral-200 hover:shadow-lg w-max">Sign Up To Falar</Link>
        </div>
}
      {(error || blocked.includes(authorid)) && (
        <div className="flex items-center content-center w-full h-screen px-10 sm:px-24 md:px-16 lg:px-24">
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
          <div className="w-full lg:pr-2 px-2 py-[6px] pb-0">
            <div className="flex flex-col rounded-none md:gap-0">
              <div className="flex items-center content-center bg-black rounded-md "></div>
              <div className="flex h-max flex-col gap-[8px] pt-4 ">
                <div className="flex flex-row items-center content-center gap-2 h-max shrink-0">
                  <Link href={"/profile/" + author} className="flex gap-[10px] px-4 mt-0">
                    <Image
                    width={28}
                    height={28}
                      src={profile}
                      alt="user profile"
                      className="rounded-md object-cover min-w-[28px] max-w-[28px] h-7"
                    />
                    <div className="flex items-center content-center">
                      <h1>
                        <p className="text-base font-medium break-all text-neutral-300 line-clamp-1">{naam}</p>
                      </h1>
                      <div className="mx-1 text-base text-neutral-400">·</div>
                      <span className="text-base font-medium text-neutral-400 whitespace-nowrap">@{author}</span>
                    </div>
                  </Link>
                  <Menu type="quickie" id={slug} myhandle={myhandle} handle={author} />
                </div>

                <div >
                  <h1
                    style={{ wordBreak: "break-word", whiteSpace: "normal" }}
                    className="px-4 my-4 mt-2 text-base text-neutral-300 four-line-ellipsis md:text-lg"
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
                        <Iof key={image} src={image} />
                      ))}
                    </div>
                  )}
                                    <h1 className="px-4 pt-0 pb-4 text-sm font-medium text-neutral-400">{createdat}</h1>


                  <div className="flex flex-row items-center content-center justify-around py-3 mt-0 border-y border-y-neutral-900">
                  <LikeComponent
            userliked={userliked}
            loggedin={loggedin}
            postid={slug}
            handle={myhandle}
            likedlist={likedlist}
            liked={liked}
            likes={likedlist.length}
          />
           <Link
            href="#comments"
            className="flex flex-row items-center content-center px-6 pr-0 space-x-2 text-white lg:mr-0"
          >
                              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M5 3h13a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-4.59l-3.7 3.71c-.18.18-.43.29-.71.29a1 1 0 0 1-1-1v-3H5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3m13 1H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h4v4l4-4h5a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2"/></svg>{" "}

            <h1 className="text-xs md:text-sm">{comments.length}</h1>
          </Link>
          <BookMarksComponent
            userliked={userbookmarked}
            postid={slug}
            loggedin={loggedin}

            handle={myhandle}
            likedlist={bookmarkedlist}
            liked={bookmarked}
            likes={bookmarkedlist.length}
          />
                  </div>
                </div>
              </div>
            </div>
            {!loggedin && 
            <>
            <div className="mb-12"></div>
      <div className="flex flex-col gap-4 px-10 mx-auto max-w-max">
      <h1 className="mx-auto text-lg font-semibold text-center text-neutral-300">Login To View Replies</h1>
      <h1 className="mx-auto text-center text-neutral-400 text-md">
        Login to {AppConfig.title} to view the replies for this Quickie
      </h1>
      <Link
        href="/"
        className={`mx-auto mt-3 w-max rounded-full px-8 py-3 text-xs font-bold ${
          1 == 1 ? "bg-primary-800 text-white" : "border-2  bg-white "
        }`}
      >
        Login Now
      </Link>
    </div>
    </>
      
      }
          </div>
          {loggedin && !newblocked.includes(authorid) && !blocked.includes(authorid)  && (
            <section className="px-0 lg:pr-0 " id="comments">

              <CommentsComponent
                myblocked={blocked}
                myname={myname}
                myphoto={myphoto}
                handle={myhandle}
                id={user}
                newblocked={newblocked}
                myhandle={myhandle}
                slug={slug}
                loggedin={loggedin}
              />
            </section>
          )}
        </div>
      )}
      
      
    </div>
  ) : (
    <div className="flex items-center content-center w-full h-screen"></div>
  );
}
