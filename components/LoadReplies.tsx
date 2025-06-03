"use client";
import { createClient } from "@/utils/supabase/client";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Oval } from "react-loader-spinner";
import QuickieComponent from "./QuickieComponent";
export default function LoadReplies(props: any) {


  const supabase = createClient();

  const [posts, setPosts] = useState<any>([]);
const [loading, setLoading] = useState<boolean>(true);

  TimeAgo.locale(en);
  const timeAgo = new TimeAgo("en-US");
  const date1 = new Date();

  



    
    useEffect( () => {
       
async function get() {
        const { data, error } = await supabase
        .from("quickies")
        .select("*, user(id,name,image,handle)")
        .order("id", { ascending: false })
        .not("poster", "in", `(${props.newblocked.toString()})`)
        .eq("to",props.to)
        .not("poster", "in", `(${props.myblocked.toString()})`)
        .limit(5);
      if (error) {
        console.log(error);
      } else {
        if (data && data.length > 0) {
          console.log(data);
          const ds = data;
          
          for await (const [index, post] of ds.entries()) {
            let liked = false;
            if(ds[index]["quote"]){
              post.quote = true;
          post.quoteid = ds[index]["quoteid"];
          const { data: q } = await supabase.from("quickies").select("*, user (name, handle, id, image)").eq("id", post.quoteid);
          if (q) {
            post.quotehandle = q[0]["user"]["handle"];
            post.quotename = q[0]["user"]["name"];
            post.quotedisplay = q[0]["user"]["image"];
            post.quoteimage = q[0]["image"];
            
            if(post.quoteimage){
              post.quotephotocount = q[0]["image"].length;
            }
            post.quotecontent = q[0]["content"];
            const date2 = new Date(q[0].created_at)
            let d = date2;
            
            post.quotetime = timeAgo.format(Date.now() - (date1.getTime() - date2.getTime()));
          }
            }
           
  
            const likedlist: string | any[] = ds[index].liked;
            let bookmarked = false;
            const bookmarkedlist: any[] = ds[index].bookmarked;
            if (likedlist.includes(props.myhandle)) {
              liked = true;
            }
            if (bookmarkedlist.includes(props.myhandle)) {
              bookmarked = true;
            }

            ds[index].liked = liked;
            ds[index].bookmarked = bookmarked;
            ds[index].bookmarkedlist = bookmarkedlist;
            ds[index].likedlist = likedlist;
            console.log(likedlist);

            const date2 = new Date(ds[index].created_at);
            ds[index].diff = date1.getTime() - date2.getTime();
          }
          setPosts([...posts, ...ds]);
         setLoading(false);
        }}
    }
    get();
    }, []);
    
  
  return (
    <>
      <div className="flex flex-col gap-0 content-center items-center w-full">
        {posts.map((post: any) => (
          <QuickieComponent
            id={post.id}
            loadedreply = {true}
            cover={post.cover}
            title={post.title}
            time={timeAgo.format(Date.now() - post.diff)}
            key={post.id}
            pid={props.to}
            image={post.image}
            userliked={props.userliked}
            userbookmarked={props.userbookmarked}
            bookmarkedlist={post.bookmarkedlist}
            likedlist={post.likedlist}
            myhandle={props.myhandle}
            dp={post.user.image}
            bookmarked={post.bookmarked}
            liked={post.liked}
            handle={post.handle}
           

quote={post.quote}
quoteid={post.quoteid}
quotehandle={post.quotehandle}
quotename={post.quotename}
quotedisplay={post.quotedisplay}
quoteimage={post.quoteimage}
quotephotocount={post.quotephotocount}
quotecontent={post.quotecontent}
quotetime={post.quotetime}
            name={post.user.name}
            comments={post.comments}
            description={post.content}
            userid={post.user.id}

          />
        ))}
{loading &&
        <Oval
          height={80}
          width={80}
          color="#000000"
          wrapperStyle={{}}
          wrapperClass="mx-auto mt-5"
          visible={!loading ? true : false}
          ariaLabel="oval-loading"
          secondaryColor="#808080"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
}

      </div>
    </>
  );
}
