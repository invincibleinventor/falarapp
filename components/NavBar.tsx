import Headeritem from "@/components/HeaderItem";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Notificationitem from "@/components/Notificationitem";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/server";
import Button from "./NewButton";
import { cookies } from "next/headers";
export default async function App$() {
  let notifications = 0;
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  let id;
  async function get() {
    const { data: user } = await supabase.auth.getUser();
    if (user.user) {
      id = user.user.id;
      const { data, error } = await supabase.from("user").select("*").eq("id", user.user.id);
      if (error) {
        console.log(error);
      } else {
        if (data && data.length > 0) {
          notifications = data[0]["notifications"];
          console.log(notifications);
        }
      }
    }
  }
  await get();

  return (
    <div className="mb-auto lg:w-[400px]">
      <div className={`flex flex-col items-start p-0 w-max md:pr-4`}>
        <Link className="flex flex-row mt-1" href="/">
          <svg
            className="ml-[8px] mr-2 mt-[2px] h-[51px] w-[51px] cursor-pointer rounded-full p-[10px]  text-neutral-300 transition-all  duration-100 ease-linear  hover:bg-neutral-900 md:ml-[4px] md:mr-0"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </Link>
        <div className="flex flex-col space-y-3 py-4 pt-[14px] md:mt-7 md:space-y-[8px] md:px-4 md:pt-[4px]">
          <Headeritem
            link="/"
            url={
              <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M6.133 21C4.955 21 4 20.02 4 18.81v-8.802c0-.665.295-1.295.8-1.71l5.867-4.818a2.09 2.09 0 0 1 2.666 0l5.866 4.818c.506.415.801 1.045.801 1.71v8.802c0 1.21-.955 2.19-2.133 2.19z"/><path d="M9.5 21v-5.5a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2V21"/></g>
            }
            name="Home"
          ></Headeritem>
          <Headeritem
            link="/quickies"
            url={
         <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M19.27 16.202A7.81 7.81 0 0 1 12.06 21c-4.313 0-7.81-3.492-7.81-7.8S5.89 7.13 8.455 3c4.806 2.1 4.806 8.4 4.806 8.4s1.579-3.038 4.807-4.5c1.034 3.042 2.43 6.365 1.202 9.302"/><path d="M12 18a5 5 0 0 1-5-5"/></g>
            }
            name="Quickies"
          ></Headeritem>
          <Notificationitem
            id={id}
            link="/notifications"
            notifications={notifications}
            url={
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.019 17h-6.04m6.04 0h3.614c1.876 0 1.559-1.86.61-2.804C15.825 10.801 20.68 3 11.999 3s-3.825 7.8-7.243 11.196c-.913.908-1.302 2.804.61 2.804H8.98m6.039 0c0 1.925-.648 4-3.02 4s-3.02-2.075-3.02-4"/>
            }
            name="Notifications"
          ></Notificationitem>
          <Headeritem
            link="/explore"
            url={
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 19.5c0-1.657-2.239-3-5-3s-5 1.343-5 3m14-3c0-1.23-1.234-2.287-3-2.75M3 16.5c0-1.23 1.234-2.287 3-2.75m12-4.014a3 3 0 1 0-4-4.472M6 9.736a3 3 0 0 1 4-4.472m2 8.236a3 3 0 1 1 0-6a3 3 0 0 1 0 6"/>
            }
            name="All People"
          ></Headeritem>
          <Headeritem
            link="/messages"
            url={
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.464 16.828C2 15.657 2 14.771 2 11s0-5.657 1.464-6.828C4.93 3 7.286 3 12 3s7.071 0 8.535 1.172S22 7.229 22 11s0 4.657-1.465 5.828C19.072 18 16.714 18 12 18c-2.51 0-3.8 1.738-6 3v-3.212c-1.094-.163-1.899-.45-2.536-.96"/>
            }
            name="Messages"
          ></Headeritem>
          <Headeritem
            link="/bookmarks"
            url={
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7.527 20.841C6.861 21.274 6 20.772 6 19.952V3.942c0-.52.336-.942.75-.942h10.5c.414 0 .75.422.75.942v16.01c0 .82-.861 1.322-1.527.89l-3.946-2.562a.96.96 0 0 0-1.054 0z"/>
            }
            name="Bookmarks"
          ></Headeritem>
          <Headeritem
            link="/myself"
            url={
              <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0"/><path d="M14.5 9.25a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0M17 19.5c-.317-6.187-9.683-6.187-10 0"/></g>
            }
            name="Profile"
          ></Headeritem>
          <Headeritem
            link="/more"
            url={
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0m-9 .25v-.5m4 .5v-.5m-8 .5v-.5"/>
            }
            name="More"
          ></Headeritem>
          <Button />
        </div>
      </div>
    </div>
  );
}
