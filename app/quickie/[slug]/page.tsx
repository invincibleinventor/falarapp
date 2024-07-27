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
export default async function App({ params }: { params: { slug: string } }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  let author = "";
  let content = "";
  const timeStamp = new Date().getTime()
  let image:any[]=[];
  let profile = "";
  let error = false;
  let naam = "";
  let time = 0;
  let loading = false;
  let myname = "";
  let myphoto = "";
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
        blocked = users[0]["blocked"]
        myname = users[0]["name"];
        myhandle = users[0]["handle"];
        userliked = users[0]["liked"];
        userbookmarked = users[0]["bookmarks"];
      }
    }
    const blockedpostgres = blocked.toString()
    const { data, error: e } = await supabase.from("quickies").select("*").eq("id", params.slug)
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
        image=data[0]["image"];
        if(image){
        photocount=data[0]["image"].length;
        }
        
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
      .from("quickiecomments")
      .select("*")
      .eq("id", params.slug)
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

  const formatText = (text:string) => {
    console.log("text", text)
    const content = text.split(/((?:#|@|https?:\/\/[^\s]+)[a-zA-Z]+)/);
    let hashtag;
    let username;
    return content.map((word) => {
        if (word.startsWith("#")) {
            hashtag = word.replace('#', '')
            return <Link legacyBehavior href={`/hashtag/${hashtag}`}><a
                className="text-cyan-800 hover:text-cyan-900">{word}</a></Link>;
        } else if (word.startsWith("@")) {
            username = word.replace('@', '')
            return <Link legacyBehavior href={`/profile/${username}`}><a
                className="text-cyan-800 hover:text-cyan-900">{word}</a></Link>;
        } else if (word.includes("http")) {
            return <a target="_blank" href={word} className="text-cyan-800 hover:text-cyan-900">{word}</a>
        } else {
            return word;
        }
    });
  }
  console.log("here");
  console.log(comments);
  console.log("above");
  return !loading ? (
    <div className="relative flex flex-col flex-1 h-screen overflow-hidden bg-transparent ">
      {(error || blocked.includes(authorid)) && (
        <div className="flex items-center content-center w-full h-screen px-10 sm:px-24 md:px-16 lg:px-24">
          <div className="flex flex-col gap-4 mx-auto max-w-max">
            <h1 className="mx-auto text-lg font-semibold text-center text-gray-300">That Quickie Doesn&apos;t Exist</h1>
            <h1 className="mx-auto text-center text-gray-500 text-md">
              That quickie does not exist. It must have been removed or deleted by the author. Please refresh if you think
              that is not the case
            </h1>
            <Link
              href="/quickies"
              className={`mx-auto mt-3 w-max rounded-full px-8 py-3 text-xs font-bold ${
                1 == 1 ? "bg-cyan-800 text-white" : "border-2  bg-white "
              }`}
            >
              Return Back
            </Link>
          </div>
        </div>
      )}
      {(!error &&  !blocked.includes(authorid)) && (
        <div className="hiddenscroll h-full w-[calc(100vw-68px)] mx-0 overflow-hidden pb-14 md:w-full md:max-w-full px-0">
          <div className="w-full lg:pr-2 px-2 py-[6px] pb-0">
        <div  className="flex flex-col rounded-none md:gap-0">
          <div  className="flex items-center content-center bg-black rounded-md ">
            
          </div>
          <div className="flex h-max flex-col gap-[8px] p-4 ">
            <div className="flex flex-row items-center content-center gap-2 h-max shrink-0">
            <Link href={"/profile/"+author} className="flex gap-[10px] mt-0">
      <img
        src={profile}
        alt="user profile"
        className="rounded-full object-cover min-w-[28px] max-w-[28px] h-7"
      />
    <div className="flex items-center content-center">
      <h1>
        <p className="text-base font-medium text-gray-300 break-all line-clamp-1">{naam}</p>
      </h1>
      <div className="mx-1 text-base text-gray-500">·</div>
      <span className="text-base font-medium text-gray-500 whitespace-nowrap">@{author}</span>
      
    </div>
   
  </Link>
  <Menu type="quickie" id={params.slug} myhandle={myhandle} handle={author}/>

            </div>

            <div>
             

              <h1
                style={{ wordBreak: "break-word", whiteSpace: "normal" }}
                className="my-4 mt-2 text-lg font-medium text-gray-300 four-line-ellipsis md:text-lg"
              >
                {formatText(content)}
              </h1>
              {photocount>0  &&
              <div className={photocount==1?"w-full border ml-0 rounded-md mt-4 aspect-video h-full mb-4":photocount==3?"mt-4 mb-4 md:gap-2 gap-1 grid thrip":"mt-4 mb-4 md:gap-2 gap-1 grid-cols-2 grid"}>
                {image.map((image:string) => 
                <Iof key={image} src={image}/>
                )}
              </div>
}


              <div className="flex flex-row items-center content-center mt-0">
      
              <h1 className="ml-auto text-sm font-medium text-gray-500">{timeAgo.format(Date.now() - time)}</h1>



              </div>
            </div>
          </div>
        </div>
      </div>
      {loggedin &&
          <section className="px-0 pt-4 pb-8 border-t lg:pr-0 border-t-gray-900" id="comments">
            <h1 className="px-6 mb-2 text-lg font-bold text-gray-300">Comments</h1>

            <CommentsComponent
            myblocked={blocked}
              myname={myname}
              myphoto={myphoto}
              handle={myhandle}
              id={user}
              myhandle={myhandle}
              slug={params.slug}
              loggedin={loggedin}
            />
          </section>
}
        </div>
      )}
      {loggedin && !blocked.includes(authorid) &&
      <div className="absolute bottom-0 flex flex-row w-full bg-black border-t h-14 border-t-gray-900 ">
      

<LikeComponent
          userliked={userliked}
          postid={params.slug}
          handle={myhandle}
          likedlist={likedlist}
          liked={liked}
          likes={likedlist.length}
        />
          <BookMarksComponent
          userliked={userbookmarked}
          postid={params.slug}
          handle={myhandle}
          likedlist={bookmarkedlist}
          liked={bookmarked}
          likes={bookmarkedlist.length}
        />
        <Link href="#comments" className="flex flex-row items-center content-center px-6 space-x-2 text-gray-300 md:mr-2 lg:mr-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
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
}
    </div>
  ) : (
    <div className="flex items-center content-center w-full h-screen"></div>
  );
}
