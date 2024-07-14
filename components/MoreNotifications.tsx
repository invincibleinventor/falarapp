"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Oval } from "react-loader-spinner";
import Notification from "./Notification";

export default function MoreNotifications() {
  const [notifications, setNotifications] = useState<any>([]);
  const [myhandle, setMyHandle] = useState("");
  const supabase = createClient();
  const [followinglist, setFollowingList] = useState([]);
  const PAGE_COUNT = 10;
  const [offset, setOffset] = useState(1);
  const { ref, inView } = useInView();
  const [halt, setHalt] = useState(false);


  async function get(from: number, to: number) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .range(from, to)
      .eq("to", `(${user?.id})`);
    if (error) {
      console.log(error);
    } else {
      if (data && data.length > 0) {
        console.log(data);
        const ds = data;
       

        setNotifications([...notifications, ...ds]);
        if (ds.length < PAGE_COUNT) {
          setHalt(true);
        }
      } else {
        setHalt(true);
      }
    }
  }
  useEffect(() => {
    if (!halt && inView) {
      setOffset((prev) => prev + 1);

      const from = offset * PAGE_COUNT;
      const to = from + PAGE_COUNT - 1;

      get(from, to);
    }
  }, [inView]);
  return (
    <div className="w-full">
      <div className="grid items-center content-center grid-cols-1 gap-2 px-3 animate-in hiddenscroll xl:grid-cols-2">
        {notifications.map((notification:any) => (
         <Notification title={notification.title} description={notification.description} type={notification.type} url={notification.url} image={notification.image} key={notification.id}></Notification>
        ))}
      </div>
      <div className="flex flex-col items-center content-center w-full">
        <Oval
          height={80}
          width={80}
          color="#000000"
          wrapperStyle={{}}
          wrapperClass="mx-auto mt-5"
          visible={!halt ? true : false}
          ariaLabel="oval-loading"
          secondaryColor="#808080"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </div>
      <div className={!halt ? "" : "hidden"} ref={ref}></div>
    </div>
  );
}
