import MoreUsers from "@/components/MoreUsers";
import Search from "@/components/SearchComponent";
import UserComponent from "@/components/UserComponent";
import { createClient } from "@/utils/supabase/server";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { cookies } from "next/headers";
import Link from "next/link";
export const revalidate = 60;
export default async function Index() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const canInitSupabaseClient = () => {
  
    try {
      createClient(cookieStore);
      return true;
    } catch (e) {
      return false;
    }
  };
  TimeAgo.locale(en);

  const isSupabaseConnected = canInitSupabaseClient();
  const empty = false;
  let users: any[] = [];
  let loading = true;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userid = user?.id;
  let myhandle = "";
  let myImage = "";
  let newblocked : any[] = []
  let blocked: any[] = [];
  let followinglist: any[] = [];
  async function get() {
    const { data: us } = await supabase.from("user").select("*").eq("id", userid);
    if (us) {
      blocked = us[0]["blocked"];
      newblocked = us[0]["blockedby"]

    }
    blocked.push(userid);

    const { data, error } = await supabase.from("user").select("*").not("id", "in", `(${newblocked.toString()})`).not("id", "in", `(${blocked.toString()})`).limit(8);
    if (error) {
      console.log(error);
    } else {
      const ds = data;
      const { data: u } = await supabase.from("user").select("*").eq("id", userid);
      let ifollow;
      if (u) {
        ifollow = u[0]["following"];
        followinglist = ifollow;
        myhandle = u[0]["handle"];
        myImage = u[0]["image"];
      }

      for await (const [index, user] of ds.entries()) {
        if (ifollow.includes(user.handle)) {
          ds[index]["isfollowing"] = true;
          console.log(user.handle, ifollow);
        } else {
          console.log(user.handle, ifollow);

          ds[index]["isfollowing"] = false;
        }
      }
      users = ds;
      console.log(users);
      loading = false;
    }
  }
  await get();

  if (isSupabaseConnected) {
    return (
      <>
        <div className="flex-1 h-screen p-0 py-2 pb-20 overflow-hidden">
          <div className="p-4 py-2 mx-1 md:mx-1">
            <Search page="people" text="Users" />
          </div>
          <div className="h-full overflow-y-scroll hiddenscroll">
            <div className="grid items-center content-center grid-cols-1 gap-2 px-5 xl:px-3 animate-in hiddenscroll xl:grid-cols-2">
              {!loading ? (
                !empty ? (
                  users.map((user) => (
                    <UserComponent
                      myID={myhandle}
                      key={user.id}
                      followerlist={user.followers}
                      followinglist={followinglist}
                      id={user.id}
                      myImage={myImage}
                      cover={user.cover}
                      name={user.name}
                      userid={user.id}
                      notifications={user.notifications}
                      following={user.following.length}
                      isfollowing={user.isfollowing}
                      handle={user.handle}
                      about={user.about}
                      followers={user.followers.length}
                      image={user.image}
                    />
                  ))
                ) : (
                  <div className="flex items-center content-center w-full px-10 mt-24 sm:px-24 md:px-16 lg:px-24">
                    <div className="flex flex-col gap-2 mx-auto max-w-max">
                      <h1 className="mx-auto text-lg font-semibold text-center text-black">No Users To View!</h1>
                      <h1 className="mx-auto text-sm text-center text-neutral-800">
                        Follow people to view their posts on your home feed. The more people you follow, the more posts
                        on your feed
                      </h1>
                      <Link
                        href="/explore"
                        className={`mx-auto mt-3 w-max px-8 py-3 text-xs font-bold  ${
                          1 == 1 ? "bg-black text-white" : "border-2 bg-white"
                        }`}
                      >
                        Explore People
                      </Link>
                    </div>
                  </div>
                )
              ) : (
                <div className="flex items-center content-center w-full h-screen"></div>
              )}
            </div>
            <MoreUsers newblocked={newblocked} blocked={blocked}></MoreUsers>
          </div>
        </div>
      </>
    );
  } else {
    return <></>;
  }
}
