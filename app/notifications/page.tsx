"use client";
import MoreNotifications from "@/components/MoreNotifications";
import Notification from "@/components/Notification";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
export default function Page() {
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const [notifications, setNotifications] = useState<any>();
  const [userid, setUserid] = useState("");
  const [empty, setEmpty] = useState(true);
  useEffect(() => {
    async function get() {
      const { data: user, error } = await supabase.auth.getUser();
      if (user) {
        if (user.user) {
          setUserid(user.user.id);
        }
        const { data: d, error: e } = await supabase
          .from("notifications")
          .select("*")
          .eq("to", user.user?.id)
          .order("id", { ascending: false });

        if (d && d.length > 0) {
          setNotifications(d);
          setEmpty(false);
        } else {
          setNotifications([]);
          setEmpty(true);
        }
      }
      setLoading(false);
    }
    get();
  });
  return (
    <div className="overflow-hidden flex-1 p-0 py-2 h-screen">
      <div className="flex flex-row justify-between items-center px-8 py-4 pb-5 border-b border-b-neutral-800 h-max">
        <h1 className="text-xl font-semibold text-white">Notifications</h1>
      </div>
      <div className="overflow-y-scroll h-full hiddenscroll">
        <div className="flex flex-col gap-0 mb-20 animate-in hiddenscroll">
          {!loading ? (
            !empty ? (
              notifications.map((post: { [x: string]: any }) => (
                <Notification
                  id={post["id"]}
                  userid={post["to"]}
                  title={post["title"]}
                  notifications={notifications.length}
                  key={post["id"]}
                  image={post["image"]}
                  description={post["description"]}
                  seen={post["seen"]}
                  url={post["url"]}
                />
              ))
            ) : (
              <div>
                <h1 className="mx-auto my-20 text-base font-medium text-center text-neutral-300 font-poppins">
                  No Notifications Yet!
                </h1>
              </div>
            )
          ) : (
            <div className="flex content-center items-center w-full h-screen">
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
          <MoreNotifications />{" "}
        </div>
      </div>
    </div>
  );
}
