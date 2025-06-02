"use client";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";
export default function Trending() {
  const supabase = createClient();
  const [date, setDate] = useState<any>();
  const [hour, setHour] = useState<any>();

  const [a, setA] = useState<any>({});
  useEffect(() => {
    const d = new Date().toLocaleDateString("en-IN");
    console.log(d);
    const s = d.split("/");

    const year = s[2];
    const month = s[1];
    const da = s[0];
    const sa = year + "/" + month + "/" + da;
    setDate(sa);
    const hs = new Date().getHours();
    setHour(hs);
    let h: any;
    if (hs >= 0 && hs < 3) {
      h = 0;
    } else if (hs >= 3 && hs < 6) {
      h = 3;
    } else if (hs >= 6 && hs < 9) {
      h = 6;
    } else if (hs >= 9 && hs < 12) {
      h = 9;
    } else if (hs >= 12 && hs < 15) {
      h = 12;
    } else if (hs >= 15 && hs < 18) {
      h = 15;
    } else if (hs >= 18 && hs < 21) {
      h = 18;
    } else {
      h = 21;
    }
    console.log(h);
    async function fetch() {
      const { data, error } = await supabase.from("trending").select(h.toString()).eq("date", sa);
      if (data && data.length > 0) {
        let j: any = data[0][h];
        console.log(j);
        const sortedArray = Object.entries(j).sort(([, valueA]: [any, any], [, valueB]: [any, any]) => valueB - valueA);
        j = Object.fromEntries(sortedArray);
        j = Object.fromEntries(Object.entries(j).slice(0, 5));
        setA(j);
        console.log(j);
        console.log(a);
      } else {
        if (error) {
          console.log(error);
        }
      }
    }
    fetch();
  }, []);

  return Object.entries(a).length > 0 ? (
    <div className="flex flex-col px-2 py-0 space-y-0 w-full h-full text-neutral-300 lg:pr-0 lg:rounded-lg lg:border-none lg:py-2 lg:text-neutral-300">
      {Object.entries(a).map(
        (t: any, k: any): React.ReactNode => (
          <Link
            key={k}
            href={"/hashtag/" + t[0]}
            className="flex flex-row content-center items-center p-4 px-6 py-4 w-full lg:px-2"
          >
            <h1 className="text-sm font-semibold">#{t[0]}</h1>
            <h1 className="ml-auto text-xs font-medium text-neutral-300">
              {t[1]} {t[1] > 1 ? "Posts" : "Post"}
            </h1>
          </Link>
        )
      )}
    </div>
  ) : (
    <div className="hidden px-5 rounded-xl lg:block lg:bg-neutral-800/30">
      <div className="flex flex-col px-2 py-0 space-y-0 w-full h-full text-neutral-300 lg:pr-0 lg:rounded-lg lg:border-none lg:py-2 lg:text-neutral-300">
        <h1 className="mx-auto my-4 text-sm text-neutral-300">No Hashtags</h1>
      </div>
    </div>
  );
}
