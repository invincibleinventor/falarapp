"use client";
import MoreUsers from "@/components/MoreSearchUsers";
import Search from "@/components/SearchComponent";

import UserComponent from "@/components/UserComponent";
import { createClient } from "@/utils/supabase/client";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import Link from "next/link";
import { use, useEffect, useState } from "react";
export default function Index({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const supabase = createClient();
  const canInitSupabaseClient = () => {
    try {
      createClient();
      return true;
    } catch (e) {
      return false;
    }
  };
  TimeAgo.locale(en);

  const isSupabaseConnected = canInitSupabaseClient();
  const [empty, setEmpty] = useState(false);
  const [users, setUsers] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [tempsearch, setTempSearch] = useState("");
  const [search, setSearch] = useState(slug);
  const [myhandle, setMyhandle] = useState("");
  const [followinglist, setFollowinglist] = useState([]);
  const [blocked, setBlocked] = useState([]);
  const [newblocked, setnewblocked] = useState([]);
  useEffect(() => {
    async function get() {
      let usersid;
      let blocked;
      let newblocked;
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        usersid = user.id;
      }
      const { data: us } = await supabase.from("user").select("*").eq("id", usersid);
      if (us && us.length > 0) {
        blocked = us[0]["blocked"];
        newblocked = us[0]["blockedby"];
      }
      blocked.push(usersid);
      setBlocked(blocked);
      setnewblocked(newblocked);

      const { data, error } = await supabase
        .from("user")
        .select("*")
        .not("id", "in", `(${blocked.toString()})`)
        .not("id", "in", `(${newblocked.toString()})`)
        .textSearch("name_handle_about", `'${search}' | '${search.toLowerCase()}' | '${search.toUpperCase()}'`)
        .limit(4);
      if (error) {
        console.log(error);
      } else {
        const ds = data;
        const { data: u } = await supabase.from("user").select("*").eq("id", usersid);
        let ifollow;
        if (u) {
          ifollow = u[0]["following"];
          setFollowinglist(ifollow);
          setMyhandle(u[0]["handle"]);

          for await (const [index, user] of ds.entries()) {
            if (ifollow.includes(user.handle)) {
              ds[index]["isfollowing"] = true;
            } else {
              ds[index]["isfollowing"] = false;
            }
          }
          setUsers(ds);
          setLoading(false);
        }
      }
    }
    get();
  }, [search]);
  if (isSupabaseConnected) {
    return (
      <>
        <div className="overflow-hidden flex-1 p-0 py-2 pb-20 h-screen">
          <div className="p-4 py-2 mx-1 md:mx-1">
            <Search text="People" page="people" value={search.replaceAll("%20", " ")}></Search>
          </div>
          <div className="overflow-y-scroll h-full hiddenscroll">
            <div className="grid grid-cols-1 gap-2 content-center items-center px-5 animate-in hiddenscroll xl:grid-cols-2">
              {!loading ? (
                !empty ? (
                  users.map((user: any) => (
                    <UserComponent
                      myID={myhandle}
                      key={user.id}
                      followerlist={user.followers}
                      followinglist={followinglist}
                      id={user.id}
                      name={user.name}
                      following={user.following.length}
                      isfollowing={user.isfollowing}
                      handle={user.handle}
                      about={user.about}
                      followers={user.followers.length}
                      image={user.image}
                      cover={user.cover}
                    />
                  ))
                ) : (
                  <div className="flex flex-grow content-center items-center px-10 mx-auto mt-24">
                    <div className="flex flex-col gap-2 ml-auto max-w-auto">
                      <h1 className="mx-auto text-lg font-semibold text-center text-white">No Users To View!</h1>
                      <h1 className="mx-auto text-sm text-center text-neutral-500">
                        The user you are searching for does not exist or may have blocked you. But fret not! There are
                        several more interesting people on Falar
                      </h1>

                      <Link
                        href="/explore"
                        className={`mx-auto mt-3 rounded-full w-max px-8 py-3 text-xs font-medium  ${
                          1 == 1 ? "bg-primary-700 text-white" : "border-2 bg-white"
                        }`}
                      >
                        Explore People
                      </Link>
                    </div>
                  </div>
                )
              ) : (
                <div className="flex content-center items-center w-full h-screen"></div>
              )}
            </div>
            <MoreUsers newblocked={newblocked} myblocked={blocked} search={search}></MoreUsers>
          </div>
        </div>
      </>
    );
  } else {
    return <></>;
  }
}
