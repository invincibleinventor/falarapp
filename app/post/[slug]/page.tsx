import BookMarksComponent from "@/components/BookMarksComponent";
import CommentsComponent from "@/components/CommentsComponent";
import LikeComponent from "@/components/LikeComponent";
import Menu from "@/components/Menu";
import UserInformation from "@/components/UserInformation";
import { AppConfig } from "@/config/config";
import { createClient } from "@/utils/supabase/server";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { ClassAttributes, ImgHTMLAttributes, JSX } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
export const revalidate = 60;
export default async function App({ params }: {params: Promise<{ slug: string }> }) {
  const slug = (await params).slug
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  let author = "";
  let content = "";
  const timeStamp = new Date().getTime();
  let title = "";
  let name = "";
  let cover = "";
  let profile = "";
  let error = false;
  let time = 0;
  let loading = false;
  let imauthor = false;
  let myname = "";
  let myphoto = "";
  let myhandle = "";
  let loggedin = false;
  let blocked: any[] = [];
  let authorid = "sample";
  let liked = false;
  let likedlist: string | any[] = [];
  let bookmarked = false;
  let bookmarkedlist: never[] = [];
  let userliked: never[] = [];
  let userbookmarked: never[] = [];
  let comments: any[] = [];
  TimeAgo.locale(en);
  let newblocked :any[] = []
  let user = "";
  const timeAgo = new TimeAgo("en-US");
  const date1 = new Date();

  async function set() {
    const { data: u } = await supabase.auth.getUser();
    if (u.user) {
      user = u.user.id;

      loggedin = true;
      const { data: users } = await supabase.from("user").select("*").eq("id", user);
      if (users) {
        myphoto = users[0]["image"];
        myname = users[0]["name"];
        blocked = users[0]["blocked"];
        newblocked = users[0]["blockedby"];
        myhandle = users[0]["handle"];
        userliked = users[0]["liked"];
        userbookmarked = users[0]["bookmarks"];
      }
    }
    const { data, error: e } = await supabase.from("posts").select("*").eq("id", slug);
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
        if (author == myhandle) {
          imauthor = true;
        }
        authorid = data[0]["poster"];
        name = u[0].name;
        profile = u[0].image;
        content = data[0]["content"];
        title = data[0]["title"];
        cover = data[0]["cover"] + "?" + timeStamp;
      }
      const date2 = new Date(data[0].created_at);
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
      .from("comments")
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
  function ClickableImage(
    props: JSX.IntrinsicAttributes & ClassAttributes<HTMLImageElement> & ImgHTMLAttributes<HTMLImageElement>
  ) {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} className="w-full max-w-full rounded-lg" />;
  }
  const components = {
    img: ClickableImage,
  };
  console.log("here");
  console.log(comments);
  console.log("above");
  return !loading ? (
    <div className="flex overflow-hidden relative flex-col flex-1 h-screen md:mr-4 lg:mx-0">
      {!loggedin &&
      
      <div className="flex flex-row justify-between content-center items-center px-6 py-4 space-y-1 w-full bg-primary-600 md:border-x md:border-x-neutral-800">
        <h1 className="text-sm font-semibold text-white">Sign up to Falar to read more such interesting articles</h1>
        <Link href={('/login')} className="px-6 py-2 w-max text-xs font-semibold text-blue-600 bg-white rounded-full transition-all duration-200 ease-linear hover:bg-neutral-200 hover:shadow-lg">Sign Up To Falar</Link>
        </div>
}
      {(error || newblocked.includes(authorid) || blocked.includes(authorid)) && (
        <div className="flex content-center items-center px-10 w-full h-screen sm:px-24 md:px-16 lg:px-24">
          <div className="flex flex-col gap-4 mx-auto max-w-max">
            <h1 className="mx-auto text-xl font-semibold text-center text-neutral-300">That Post Doesn&apos;t Exist</h1>
            <h1 className="mx-auto text-sm text-center text-neutral-400">
              That post does not exist or you do not have permission to view it. It must have been removed or you must have been blocked by the author. Please refresh if you think
              that is not the case
            </h1>
            <Link
              href="/"
              className={`mx-auto mt-4 rounded-full w-max px-8 py-3 text-xs font-bold ${
                1 == 1 ? "bg-primary-700 text-white" : "border-2  bg-white "
              }`}
            >
              Return Back
            </Link>
          </div>
        </div>
      )}
      {!error && !newblocked.includes(authorid) && !blocked.includes(authorid) && (
        <div className="hiddenscroll h-full w-[calc(100vw-68px)] overflow-hidden pb-14 md:w-full md:max-w-full md:border-x md:border-x-neutral-800">
          <div className="relative aspect-video">
            <img
              alt="coveri"
              src={cover ? cover : "https://picsum.photos/2000/3000"}
              className="object-cover absolute inset-0 w-full h-full aspect-video"
            />
          </div>
          <div className="flex flex-col flex-1 p-8 w-full max-w-full">
            <h1 className="fix-overflow text-neutral-300 text-3xl font-extrabold md:text-5xl md:leading-[calc(14*4px)]">
              {title}
            </h1>
            {imauthor && (
              <Link
                href={"/edit/" + slug}
                className="my-4 ml-auto mt-6 flex cursor-pointer flex-row  content-center items-center space-x-[16px] px-1  pr-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-neutral-300"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="m5 16l-1 4l4-1L19.586 7.414a2 2 0 0 0 0-2.828l-.172-.172a2 2 0 0 0-2.828 0zM15 6l3 3m-5 11h8"
                  />
                </svg>

                <h1 className="inline-block text-sm text-neutral-300">Edit Post</h1>
              </Link>
            )}

            <div className="flex sticky top-0 flex-row justify-between content-center items-center py-4 mt-2 text-lg">
              <Link href={"/profile/" + author} className="flex flex-row content-center items-center">
                <UserInformation id={authorid} image={profile} imgclass="w-7 h-7 mr-3 rounded-md"  />
                <h1 className="text-xs font-medium text-white md:text-sm">{name}</h1>
                
              </Link>

              <div className="flex flex-row">
                <h1 className="text-xs font-normal text-neutral-300 md:text-sm">
                  <span className="hidden md:inline-block">Posted</span> {timeAgo.format(Date.now() - time)}{" "}
                </h1>{" "}
                {myhandle !== author && <Menu type="post" id={slug} myhandle={myhandle} handle={author} />}
              </div>
            </div>
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={components}
              className="mt-12 prose text-neutral-300 prose-invert font-poppins fix-overflow"
            >
              {content}
            </Markdown>
          </div>
          {!loggedin && 
            <>
            <div className="mb-10 h-1 border-b border-b-neutral-900"></div>
      <div className="flex flex-col gap-4 px-10 mx-auto max-w-max">
      <h1 className="mx-auto text-lg font-semibold text-center text-neutral-300">Login To View Replies</h1>
      <h1 className="mx-auto text-center text-neutral-400 text-md">
        Login to {AppConfig.title} to view the replies for this post
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
          {loggedin && !newblocked.includes(authorid) && !blocked.includes(authorid) && (
            <section className="px-0 border-t border-t-neutral-900" id="comments">

              <CommentsComponent
                myname={myname}
                myphoto={myphoto}
                handle={myhandle}
                id={user}
                newblocked={newblocked}
                myhandle={myhandle}
                myblocked={blocked}
                slug={slug}
                loggedin={loggedin}
              />
            </section>
          )}
        </div>
      )}
      {loggedin && !blocked.includes(authorid) && !newblocked.includes(authorid)  && (
        <div className="absolute bottom-0 z-[1000000] flex flex-row w-full border-t bg-[#000205]/30 backdrop-blur-lg border-x h-14 border-t-neutral-800 border-x-neutral-800">
          <BookMarksComponent
            userliked={userbookmarked}
            postid={slug}
            handle={myhandle}
            likedlist={bookmarkedlist}
            liked={bookmarked}
          />

          <LikeComponent
            userliked={userliked}
            postid={slug}
            handle={myhandle}
            likedlist={likedlist}
            liked={liked}
            likes={likedlist.length}
          />

          <Link
            href="#comments"
            className="flex flex-row content-center items-center px-6 ml-auto space-x-2 text-neutral-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="m4 11.29l1-1v1.42l-1.15 1.14L3 12.5V10H1.5L1 9.5v-8l.5-.5h12l.5.5V6h-1V2H2v7h1.5l.5.5zM10.29 13l1.86 1.85l.85-.35V13h1.5l.5-.5v-5l-.5-.5h-8l-.5.5v5l.5.5zm.21-1H7V8h7v4h-1.5l-.5.5v.79l-1.15-1.14z"
                clipRule="evenodd"
              />
            </svg>{" "}
            <h1 className="text-xs md:text-sm">Comments</h1>
          </Link>
        </div>
      )}
    </div>
  ) : (
    <div className="flex content-center items-center w-full h-screen"></div>
  );
}
