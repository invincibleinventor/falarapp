"use client";
import MoreUsers from "@/components/MoreSearchUsers";

import UserComponent from "@/components/UserComponent";
import { createClient } from "@/utils/supabase/client";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import Link from "next/link";
import { use, useEffect, useState } from "react";
export default function Index({ params }: { params: Promise<{ slug: string }>}) {
  const {slug} = use(params);
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
  const [newblocked,setnewblocked ] = useState([])
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
        newblocked = us[0]["blockedby"]
      }
      blocked.push(usersid);
      setBlocked(blocked);      setnewblocked(newblocked);

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
          console.log(users);
          setLoading(false);
        }
      }
    }
    get();
  }, [search]);
  if (isSupabaseConnected) {
    return (
      <>
        <div className="flex-1 h-screen p-0 py-2 pb-20 overflow-hidden">
          <div className="p-4 py-2 mx-1 md:mx-1">
            <div className="relative items-center content-center">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className=" md:bottom-3 absolute inset-y-0 right-0 my-auto mr-6 h-[14px] w-[14px] text-neutral-400"
              >
                <g>
                  <path
                    fill="currentColor"
                    d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"
                  ></path>
                </g>
              </svg>
              <input
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (tempsearch != "") {
                      setSearch(tempsearch);
                    } else {
                      setEmpty(true);
                    }
                  }
                }}
                defaultValue={search.replaceAll("%20", " ")}
                onChange={(e) => setTempSearch(e.target.value.trim())}
                minLength={4}
                maxLength={50}
                type="search"
                className="font-inter md:mb-3 rounded-full peer h-[48px] w-full bg-neutral-700/20 focus:outline-none pl-6 pr-14 text-[14px] placeholder:text-neutral-400 text-neutral-300"
                placeholder={"Search Posts"}
              ></input>
            </div>{" "}
          </div>
          <div className="h-full overflow-y-scroll hiddenscroll">
            <div className="grid items-center content-center grid-cols-1 gap-2 px-5 animate-in hiddenscroll xl:grid-cols-2">
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
                  <div className="flex items-center content-center w-full px-10 mt-24 sm:px-24 md:px-16 lg:px-24">
                    <div className="flex flex-col gap-2 mx-auto max-w-max">
                      <h1 className="mx-auto text-lg font-semibold text-center text-black">No Users To View!</h1>
                      <h1 className="mx-auto text-sm text-center text-neutral-800">
                        Follow people to view their posts on your home feed. The more people you follow, the more posts
                        on your feed
                      </h1>

                      <Link
                        href="/explore"
                        className={`mx-auto mt-3 rounded-full w-max px-8 py-3 text-xs font-medium  ${
                          1 == 1 ? "bg-primary-800 text-white" : "border-2 bg-white"
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
            <MoreUsers newblocked={newblocked} myblocked={blocked} search={search}></MoreUsers>
          </div>
        </div>
      </>
    );
  } else {
    return <></>;
  }
}
