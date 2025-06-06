'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import More from "@/components/MoreInduvidualQuickies";
import PostComponent from "@/components/QuickieComponent";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { redirect } from "next/navigation";
import MoreMediaGrid from "@/components/MoreMediaGridQuickies";
TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

export default function Index(props:any) {
  const [posts, setPosts] = useState<any[]>([]);
  const [userliked, setUserLiked] = useState<any[]>([]);
  const [userbookmarked, setUserBookmarked] = useState<any[]>([]);
  const [myblocked, setMyBlocked] = useState<any[]>([]);
  const [newblocked, setNewBlocked] = useState<any[]>([]);
  const [myhandle, setMyHandle] = useState("");
  const [myname, setMyName] = useState("");
  const [myphoto, setMyPhoto] = useState("");
  const [l, setL] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(true);
 const [images,setImages] = useState<any[]>([]);

  
  useEffect(() => {
    const supabase = createClient();
    const date1 = new Date();

    const getData = async () => {
      


      const { data, error } = await supabase
        .from("quickies")
        .select(`*, user (name, id, handle, image)`)
        .order("id", { ascending: false })
        .eq("handle",props.handle )
        .not('image', 'is', null)

     
        .limit(6);

      if (error) {
        console.log(error);
        setLoading(false);
        return;
      }
     
      else if (data && data.length>0){
        let ss = [];
      let ens:any={};
        const ds = data;
        console.log(ds)
          for await (const [index, post] of ds.entries()) {
            for(let i = 0;i<post.image.length;i++){
                
              ens = {
                image: post.image[i],
                url: post.id,
              }
              ss.push(ens);
            }

        }
          setImages([...images,...ss]);
      setEmpty(ds.length === 0);
      setLoading(false);
    }
    else{
       console.log("empty")
        setLoading(false);
        setEmpty(true);
        return;
      
}   
    }
    
    getData();
  }, []);

  return (
    <div>
    <div >


        {!loading ? (
          !empty ? (
            <div className="grid grid-cols-3 gap-2 px-5 py-5 md:gap-4">
            {images.map((post) => (
              <img className="object-cover col-span-1 rounded-xl border shadow-lg cursor-pointer border-neutral-900 aspect-square" src={post.image} onClick={()=>redirect('/quickie/'+post.url)} />
            ))
          }
            </div>
          ) : (
            <div className="flex content-center items-center px-10 mt-24 w-full sm:px-24 md:px-16 lg:px-24">
              <div className="flex flex-col gap-2 mx-auto max-w-max">
                <h1 className="mx-auto text-lg font-semibold text-center text-neutral-300">No Media To View!</h1>
                <h1 className="mx-auto text-sm text-center text-neutral-400">
                  The user you are viewing hasn't posted any media yet.
                </h1>
                
              </div>
            </div>
          )
        ) : (
          <div className="flex content-center items-center w-full h-screen"></div>
        )}

      
      </div>
      <MoreMediaGrid
          myblocked={myblocked}
          myhandle={myhandle}
          myname={myname}
          myphoto={myphoto}
          handle={props.handle}
          newblocked={newblocked}
          userliked={userliked}
          userbookmarked={userbookmarked}
          in={l}
        />
        </div>
  );
}
