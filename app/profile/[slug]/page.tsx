"use client";
import More from "@/components/More";
import PostComponent from "@/components/PostComponent";
import notification from "@/utils/notifications/notification";
import { createClient } from "@/utils/supabase/client";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const supabase = createClient();
  const [image, setImage] = useState("");
  const [posts, setPosts] = useState<any>([]);
  const [resume, setIsResume] = useState(false);
  const [myImage, setMyImage] = useState("");
  const [hisId, setHisId] = useState("");
  const [loggedin, setloggedin] = useState(false);
  const [about, setAbout] = useState("");
  const [loading, setLoading] = useState(true);
  const [cover, setCover] = useState("true");
  const [myuserid, setMyuserid] = useState("");
  const [name, setName] = useState("");
  const [following, setFollowing] = useState(0);
  const [imfollowing, setImFollowing] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [followerlist, setFollowerList] = useState<any>([]);
  const [followinglist, setFollowingList] = useState<any>([]);
  const [found, setFound] = useState(true);
  const [myself, setMyself] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [blockedby, setblockedby] = useState<any>([]);
  const [imblockedby, setimblockedby] = useState(false);
  const [myId, setMyId] = useState<string | undefined>();
  const [blockedlist, setBlockedlist] = useState<any>([]);
  const [blocked, setBlocked] = useState(false);
  useEffect(() => {
    async function get() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setloggedin(true);
      }
      const { data: pd, error: pe } = await supabase.from("user").select("*").eq("handle", slug);
      if (pe || pd.length == 0) {
        setFound(false);
        setAbout("That user does not exist or you do not have access to view their profile");
        setLoading(false);
      } else {
        if (pd.length > 0) {
          {
            setFound(true);
            setName(pd[0].name);
            setHisId(pd[0].id);
            setCover(pd[0].cover);
            setAbout(pd[0].about);
            setNotifications(pd[0].notifications);
            setImage(pd[0].image);
            setIsResume(pd[0].isresume);
            setFollowers(pd[0].followers.length);
            setFollowing(pd[0].following.length);

            if (user) {
              const { data } = await supabase.from("user").select("*").eq("id",user.id);
              if (data) {
                setMyImage(data[0].image);
                setMyId(data[0].handle);
                setMyuserid(user.id);
                setBlockedlist(data[0].blocked);
                setFollowerList(pd[0].followers);
                setblockedby(pd[0].blockedby);
                
                setFollowingList(data[0].following);
                console.log("below");
                console.log(pd[0].id);
                console.log(data[0].blocked);
                if (data[0].blocked.includes(pd[0].id)) {
                  setBlocked(true);
                  console.log("blockkkedd");
                } else {
                  console.log("illla");
                  setBlocked(false);
                }

                if (data[0].blockedby.includes(pd[0].id)) {
                  setimblockedby(true);
                  console.log("blockkkedd");
                } else {
                  console.log("illla");
                  setimblockedby(false);
                }
                if (data[0].handle == slug) {
                  setMyself(true);
                } else if (pd[0].followers.includes(data[0].handle)) {
                  setImFollowing(true);
                } else {
                  setImFollowing(false);
                }
              }
            } else {
            }
          }
        }
      }
    }
    get();
  }, [imfollowing]);

  TimeAgo.locale(en);

  async function determine() {
    if (blocked) {
      const { data:mine } = await supabase.from("user").select("*").eq("id",myuserid);
      const { data:his } = await supabase.from("user").select("*").eq("id",hisId);
      let b,c;
      if(mine && his){
      b = mine[0]["blocked"];
      c = his[0]["blockedby"];
      }
      b = b.filter((item: string) => item !== hisId);

      c = c.filter((item: string) => item !== myuserid);
      const { error } = await supabase.from("user").update({ blocked: b }).eq("id", myuserid);
      if (error) {
        alert(error);
      } else {
        console.log('okok')
        const { error } = await supabase.from("user").update({ blockedby: c }).eq("id", hisId);
        if(error){
          alert(error.message)
          console.log(error)
        }
        else{
          console.log('ooo')

       window.location.reload();
      }
    }
  }
    else {
      const { data:mine } = await supabase.from("user").select("*").eq("id",myuserid);
      const { data:his } = await supabase.from("user").select("*").eq("id",hisId);
      let b,c;
      let localfollowerlist,localfollowinglist;
      if(mine && his){
      b = mine[0]["blocked"];
      c = his[0]["blockedby"];
      localfollowerlist = his[0]["followers"]
      localfollowinglist = mine[0]["following"];
      
    }
      b.push(hisId);
      
      c.push(myuserid)

      const { error } = await supabase.from("user").update({ blocked: b }).eq("id", myuserid);
      
      if (error) {
        
        alert(error);
      } else {
        const { error } = await supabase.from("user").update({ blockedby: c }).eq("id", hisId);
        if(error) {
          console.log(error)
          alert(error.message)
        }
        if (localfollowerlist.includes(myId)) {
          console.log("uesuesues");
          let arr: any = localfollowerlist;
          console.log("before");
          console.log(arr);
          arr = arr.filter((item: any) => item !== myId);
          let arr2 = localfollowinglist;
          arr2 = arr2.filter((item: string) => item !== slug);

          console.log(arr);
          const { data, error } = await supabase
            .from("user")
            .update({ followers: arr })
            .eq("handle", slug)
            .select();
          const { data: d, error: e } = await supabase
            .from("user")
            .update({ following: arr2 })
            .eq("handle", myId)
            .select();

          if (error || e) {
            console.log(error?.message);
            console.log(e?.message);
          } else {
            console.log(data);

            setFollowerList(arr);
            setFollowingList(arr2);
            setImFollowing(false);
           window.location.reload();
          }
        } else {
         window.location.reload();
        }
      }
    }
  }

  const timeAgo = new TimeAgo("en-US");
  const date1 = new Date();
  useEffect(() => {
    async function get() {
      const { data, error } = await supabase
        .from("posts")
        .select("*,user(id,name,handle,image)")
        .eq("handle", slug)
        .order("id", { ascending: false })
        .limit(5);
      if (error) {
        console.log(error);
      } else {
        console.log(data);
        const ds = data;
        for await (const [index, post] of ds.entries()) {
          const date2 = new Date(ds[index].created_at);
          ds[index].diff = date1.getTime() - date2.getTime();
        }

        setPosts(ds);
        setLoading(false);
      }
    }
    get();
  }, []);
  async function onfollow() {
    let localfollowerlist,localfollowinglist
    const { data:mine } = await supabase.from("user").select("*").eq("id",myuserid);
    const { data:his } = await supabase.from("user").select("*").eq("id",hisId);
    
    if(mine && his){
      localfollowerlist = his[0]["followers"]
      localfollowinglist = mine[0]["following"]
      
  }
    if (myself) {
      router.push("/more/");
    } else {
      if (localfollowerlist.includes(myId)) {
        console.log("uesuesues");
        let arr: any = localfollowerlist;
        console.log("before");
        console.log(arr);
        arr = arr.filter((item: any) => item !== myId);
        let arr2 = localfollowerlist;
        arr2 = arr2.filter((item: string) => item !== slug);

        console.log(arr);
        const { data, error } = await supabase
          .from("user")
          .update({ followers: arr })
          .eq("handle", slug)
          .select();
        const { data: d, error: e } = await supabase
          .from("user")
          .update({ following: arr2 })
          .eq("handle", myId)
          .select();

        if (error || e) {
          console.log(error?.message);
          console.log(e?.message);
        } else {
          console.log(data);
        }
        setFollowerList(arr);
        setFollowingList(arr2);
        setImFollowing(false);
      } else {
        const arr: any = localfollowerlist;
        arr.push(myId);
        let arr2: any = [];
        arr2 = localfollowinglist;
        arr2.push(slug);
        console.log(arr);
        const { data, error } = await supabase
          .from("user")
          .update({ followers: arr })
          .eq("handle", slug)
          .select();
        const { data: d, error: e } = await supabase
          .from("user")
          .update({ following: arr2 })
          .eq("handle", myId)
          .select();

        if (error || e) {
          console.log(error?.message);
          console.log(e?.message);
        } else {
          notification(
            notifications,
            supabase,
            hisId,
            "/profile/" + myId,
            "New Follower",
            "follow",
            myuserid,
            "@" + myId + " has followed you! Follow them back?",
            myImage
          );
          console.log(data);
        }
        setImFollowing(true);
        setFollowerList(arr);
        setFollowingList(arr2);
      }
    }
  }
  return !loading ? (
    <div className="flex-1 h-screen p-0 overflow-hidden">
        {!loggedin &&
      
      <div className="flex flex-row items-center content-center justify-between w-full px-6 py-4 space-y-1 bg-blue-600 ">
        <h1 className="text-sm font-semibold text-white">Sign up to Falar to view more such interesting people</h1>
        <Link href={('/login')} className="px-6 py-2 text-xs font-semibold text-blue-600 transition-all duration-200 ease-linear bg-white rounded-full hover:bg-neutral-200 hover:shadow-lg w-max">Sign Up To Falar</Link>
        </div>
}
      <div className="h-full pb-10 overflow-y-scroll hiddenscroll">
        <div className="relative h-64">
          <div className="m-0 h-48 w-[calc(100%)] rounded-none  bg-neutral-200 ">
            {cover && (
              <Image
                width={180}
                unoptimized={true}
                height={180}
                loader={() => (found ? (cover ? cover : "/bg.jpg") : "/bg.jpg")}
                src={`${found ? (cover ? cover : "/bg.jpg") : "/bg.jpg"}`}
                className="object-cover w-full h-48 rounded-none "
                alt="cover"
              />
            )}
          </div>
          <Image
            width={90}
            height={90}
            unoptimized={true}
            className="absolute w-24 h-24 rounded-lg bottom-5 left-7 md:left-12"
            loader={() => (found ? image : "/usernotfound.png")}
            src={`${found ? image : "/usernotfound.png"}`}
            alt="userimage"
          />
          {found && loggedin && !blocked  && !imblockedby && (
            <button
              onClick={() => onfollow()}
              className={`absolute rounded-full bottom-10 right-7 px-8 py-3 text-xs font-semibold md:right-12  ${
                !(imfollowing || myself) ? "border-[1px] bg-cyan-800 text-white" : "border-[1px] bg-white text-black"
              }`}
            >
              {myself ? "Edit Profile" : imfollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>
        <div className="flex flex-col gap-0 ml-8 md:ml-14">
          {found && (
            <div className="flex flex-row items-start justify-between">
              <div className="flex flex-col content-center sm:gap-2 sm:items-center sm:flex-row ">
                <h1 className="text-xl font-semibold text-neutral-300">{name}</h1>

                <h1 className="text-sm font-normal text-neutral-500">@{slug}</h1>
              </div>
              {!myself && loggedin && (
                <div className="flex flex-row items-center content-center gap-2 mb-2">
                  {!imblockedby &&
                  <button
                    onClick={() => determine()}
                    className="px-4 py-1 text-xs font-medium text-red-400 border-2 rounded-full border-red-900/40 "
                  >
                    {blocked  ? "Unblock" : "Block"}
                  </button>}
                  <Link
                    href={"/report/user/" + slug}
                    className="px-4 py-1 mr-8 text-[10px] font-medium text-white border-2 border-neutral-900 rounded-full md:mr-14"
                  >
                    {"Report"}
                  </Link>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col justify-between gap-2 sm:gap-0 sm:flex-row">
            <h1
              style={{ wordBreak: "break-word", whiteSpace: "normal" }}
              className="mt-1 mr-12 text-sm font-normal leading-relaxed text-neutral-500 two-line-elipsis sm:text-neutral-500"
            >
              {blocked && "You have blocked this user. Unblock them to view their posts."}
              {imblockedby && !blocked && "This user has blocked you. You can no longer view their posts or quickies."}
              {!blocked && !imblockedby && about}
            </h1>

            <div className={resume ? "mr-16  flex flex-row" : "mr-16 flex flex-row"}>
              <Link href={"/resume/" + slug} className={resume ? "text-sm font-medium text-blue-600" : "hidden"}>
                View Resume
              </Link>
            </div>
          </div>
        </div>
        {found && !blocked && !imblockedby && (
          <>
            <div className="flex flex-row items-center content-center gap-6 p-4 mx-8 my-4 mb-1 rounded-md bg-neutral-800/30 md:mx-14">
              <div className="flex flex-row w-full md:mx-auto">
                <div className="flex flex-col items-center content-center gap-1 mx-auto w-max">
                  <h1 className="text-xs font-semibold text-neutral-300">Followers</h1>
                  <h1 className="text-sm font-medium text-neutral-500">{followers} Followers</h1>
                </div>
                <div className="flex flex-col items-center content-center gap-1 mx-auto w-max">
                  <h1 className="text-xs font-semibold text-neutral-300">Following</h1>
                  <h1 className="text-sm font-medium text-neutral-500">{following} Following</h1>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-8 mt-8 mb-4 lex-row md:mb-4 md:mt-10">
              <h1 className="text-lg font-bold text-white ">{name}&apos;s Posts</h1>
             {!blocked && !imblockedby &&
              <Link
                href={"/quickies/" + slug}
                className="py-2 ml-2 text-sm font-medium text-white rounded-full cursor-pointer md:px-6 md:bg-neutral-900/50 "
              >
                View Quickies
              </Link>
}
            </div>
            <div className="flex flex-col gap-2 px-0 md:px-0">
              {!loading ? (
                posts.length > 0 ? (
                  posts.map((post: any) => (
                    <PostComponent
                      id={post["id"]}
                      type="profile"
                      title={post["title"]}
                      cover={post["cover"]}
                      time={timeAgo.format(Date.now() - post["diff"])}
                      key={post["id"]}
                      image={post["image"]}
                      dp={post["user"]["image"]}
                      handle={post["handle"]}
                      name={post["user"]["name"]}
                      userid={post.user.id}

                      likes={post.likes}
                      description={post["excerpt"]}
                    />
                  ))
                ) : (
                  <>
                    <h1 className="px-[32px] text-sm font-medium text-neutral-700">
                      No Posts To Display. {name} haven&apos;t posted anything yet.
                    </h1>
                  </>
                )
              ) : (
                <div className="flex flex-col items-center content-center mt-10">
                  <Oval
                    height={80}
                    width={80}
                    color="#000000"
                    wrapperStyle={{}}
                    wrapperClass="mx-auto"
                    visible={true}
                    ariaLabel="oval-loading"
                    secondaryColor="#808080"
                    strokeWidth={2}
                    strokeWidthSecondary={2}
                  />
                </div>
              )}
              <More myblocked={blocked} handle={slug} />
            </div>
          </>
        )}
      </div>
    </div>
  ) : (
    <div className="flex items-center content-center w-full h-screen">
      <Oval
        height={80}
        width={80}
        color="#000000"
        wrapperStyle={{}}
        wrapperClass="mx-auto"
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#808080"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  );
}
