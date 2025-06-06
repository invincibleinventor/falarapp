"use client";
import { createClient } from "@/utils/supabase/client";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Oval } from "react-loader-spinner";
import QuickieComponent from "./QuickieComponent";
import { redirect } from "next/navigation";
export default function More(props: any) {
  const [quote, setQuote] = useState<boolean>(false);
  const [quoteid, setQuoteid] = useState<string>("");
  const [quotehandle, setQuotehandle] = useState<string>("");
  const [quotename, setQuotename] = useState<string>("");
  const [quotedisplay, setQuotedisplay] = useState<string>("");
  const [quoteimage, setQuoteimage] = useState<any[]>([]);
  const [quotephotocount, setQuotephotocount] = useState<number>(0);
  const [quotecontent, setQuotecontent] = useState<string>("");
  const [quotetime, setQuotetime] = useState<string>("");
  const [images, setImages] = useState<any>([]);
  const supabase = createClient();
  const [offset, setOffset] = useState(1);
  const { ref, inView } = useInView();
  const [halt, setHalt] = useState(false);
  const [posts, setPosts] = useState<any>([]);

  TimeAgo.locale(en);
  const PAGE_COUNT = 6;
  const timeAgo = new TimeAgo("en-US");
  const date1 = new Date();

  async function get(from: number, to: number) {
    const { data, error } = await supabase
      .from("quickies")
      .select("*, user(id,name,image,handle)")
      .order("id", { ascending: false })
      .eq("handle", props.handle)
      .not("image", "is", null)
      .range(from, to);
    if (error) {
      console.log(error);
    } else {
      if (data && data.length > 0) {
        let ss = [];
        let ens: any = {};
        const ds = data;
        for await (const [index, post] of ds.entries()) {
          for (let i = 0; i < post.image.length; i++) {
            ens = {
              image: post.image[i],
              url: post.id,
            };
            ss.push(ens);
          }
        }

        setImages([...images, ...ss]);
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
    <>
      <div className="grid grid-cols-3 gap-2 content-center items-center px-5 pb-20 w-full md:gap-4">
        {images.map((post: any) => (
          <img
            className="object-cover col-span-1 rounded-xl border shadow-lg cursor-pointer border-neutral-900 aspect-square"
            src={post.image}
            onClick={() => redirect("/quickie/" + post.url)}
          />
        ))}
        <div className={!halt ? "min-h-[1px]" : "hidden"} ref={ref}></div>

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
    </>
  );
}
