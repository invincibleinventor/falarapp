import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Whouser from "./whouser";
export default async function WhoToFollow() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: u } = await supabase.auth.getUser();
  let loggedin = false;
  let empty = true;
  let userlist: any[] = [];
  let following: any[] = [];
  let myid = "";
  let myhandle = "";
  let myImage = "";

  if (u.user) {
    myid = u.user.id;
    loggedin = true;
    const { data, error } = await supabase.from("user").select("*").eq("id", u.user.id);
    if (data && data.length > 0) {
      myhandle = data[0]["handle"];
      following = data[0]["following"];
      const blocked = data[0]["blocked"];
      const myblocked = data[0]["blockedby"];
      const l = following;
      myImage = data[0]["image"];
      l.push(myhandle);
      console.log(l);
      const { data: d, error: e } = await supabase
        .from("user")
        .select("*")
        .not("id", "in", `(${blocked.toString()})`)
        .not("id", "in", `(${myblocked.toString()})`)
        .not("handle", "in", `(${l.toString()})`);
      if (d && d.length > 0) {
        const shuffled = d.sort(() => 0.5 - Math.random());

        userlist = shuffled.slice(0, 3);

        empty = false;
        console.log('belowwwww')
        console.log(userlist)
      } else {
        empty = true;
      }
    }
  }
  return loggedin && !empty ? (
    <div className="w-full flex flex-col space-y-1  pt-[14px] md:mt-[calc(17*4px)] md:space-y-[0px] md:mx-4 md:pt-[4px]">
      <div className="px-5 py-4 mx-10 rounded-xl bg-neutral-800/30">
        <h1 className="mb-5 text-base font-medium text-white font-poppins">Who To Follow</h1>
        <div className="flex flex-col space-y-5">
          {userlist.map((user: any) => (
            <Whouser
              key={user.id}
              hisid={user.id}
              name={user.name}
              notifications={user.notifications}
              followinglist={following}
              myImage={myImage}
              profile={user.image}
              followerlist={user.followers}
              myid={myid}
              myhandle={myhandle}
              handle={user.handle}
            ></Whouser>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}
