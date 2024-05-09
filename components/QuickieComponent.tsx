/* eslint-disable react/jsx-key */
"use client";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import BookMarksComponent from "./QuickieBookMarksComponent";
import LikeComponent from "./QuickieLikeComponent";
export default function Post(props:any) {
  let x = props.name;
  if (x.length >= 11) {
    x = x.slice(0, 7);
    x += "...";
  }
  const a = props.title;
let photocount;
  if(props.image){
photocount = props.image.length;
  }
  const formatText = (text:string) => {
    console.log("text", text)
    const content = text.split(/((?:#|@|https?:\/\/[^\s]+)[a-zA-Z]+)/);
    let hashtag;
    const regex = /^[a-zA-Z]+$/;

    let username;
    return content.map((word) => {
        if (word.startsWith("#") && regex.test(word.slice(1,word.length-1))) {
            hashtag = word.replace('#', '')
            return <Link legacyBehavior href={`/hashtag/${hashtag}`}><a
                className="text-cyan-600 hover:text-cyan-700">{word}</a></Link>;
        } else if (word.startsWith("@")) {
            username = word.replace('@', '')
            return <Link legacyBehavior href={`/profile/${username}`}><a
                className="text-cyan-600 hover:text-cyan-700">{word}</a></Link>;
        } else if (word.includes("http")) {
            return <a target="_blank" href={word} className="text-cyan-600 hover:text-cyan-700">{word}</a>
        } else {
            return word;
        }
    });
  }
  return (
    <div className="w-full animate-in" >
      <div className="w-full ">
        <div  className="flex flex-col px-2 py-2 border-b md:pr-2 lg:pr-2 border-b-gray-900 md:py-0">
          <div  className="flex items-center content-center bg-black rounded-md ">
            
          </div>
          <div className="flex h-max flex-col gap-[8px] md:p-6 p-4 ">
          <Link href={"/profile/"+props.handle} className="flex gap-2 mt-0">
      <img
        src={props.dp}
        alt="user profile"
        className="rounded-full object-cover min-w-[24px] max-w-[24px] h-6"
      />
    <div className="flex items-center content-center">
      <h1>
        <p className="text-sm font-medium text-gray-300 break-all line-clamp-1">{props.name}</p>
      </h1>
      <div className="mx-1 text-sm text-gray-500">·</div>
      <span className="text-sm font-medium text-gray-500 whitespace-nowrap">@{props.handle}</span>
      
    </div>
    <div className="pl-3 ml-auto text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M12 16.5a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3m0-6a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3m0-6a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3"/></g></svg>
              </div>
  </Link>

            <div>
          
            <Link
              href={'/quickie/'+props.id}
                style={{ wordBreak: "break-word", whiteSpace: "normal" }}
                className="mt-[6px] pl-0 ml-0 text-[16px] font-medium text-gray-300 four-line-ellipsis md:text-[15px]"
              >
                {formatText(props.description)}
              </Link>

             
              {photocount>0  &&
              <div className={photocount==1?"w-full border ml-0 rounded-md mt-4 aspect-video h-full mb-4":"mt-4 mb-4 md:gap-2 gap-1 grid-cols-2 grid"}>
                {props.image.map((image:string) => 
                  <img onClick={()=>window.open(image,'_blank')?.focus()} className="object-cover w-full border rounded-md h-max aspect-video" src={image}></img>
                )}
              </div>
}


              <div className="flex px-[2px] flex-row items-center content-center mt-4">
              
              <LikeComponent
          userliked={props.userliked}
          postid={props.id}
          handle={props.myhandle}
          likedlist={props.likedlist}
          liked={props.liked}
          likes={props.likedlist.length}
        />

        <BookMarksComponent
          userliked={props.userbookmarked}
          postid={props.id}
          handle={props.myhandle}
          likedlist={props.bookmarkedlist}
          liked={props.bookmarked}
          likes={props.bookmarkedlist.length}
        />
         <Link href={"/quickie/"+props.id} className="flex flex-row items-center content-center pl-6 pr-2 space-x-2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="m4 11.29l1-1v1.42l-1.15 1.14L3 12.5V10H1.5L1 9.5v-8l.5-.5h12l.5.5V6h-1V2H2v7h1.5l.5.5zM10.29 13l1.86 1.85l.85-.35V13h1.5l.5-.5v-5l-.5-.5h-8l-.5.5v5l.5.5zm.21-1H7V8h7v4h-1.5l-.5.5v.79l-1.15-1.14z"
              clipRule="evenodd"
            />
          </svg>{" "}
          <h1 className="text-xs">{props.comments}</h1>
        </Link>
        <span className="ml-auto"></span>

        <h1 className="text-sm font-medium text-gray-500 ">{props.time}</h1>



              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
