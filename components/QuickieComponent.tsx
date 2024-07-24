/* eslint-disable react/jsx-key */
"use client";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import BookMarksComponent from "./QuickieBookMarksComponent";
import LikeComponent from "./QuickieLikeComponent";
import { useState } from "react";
import Menu from "./Menu";
export default function Post(props:any) {
  const [dialogopened,setDialogopened] = useState(false)
  const timeStamp = new Date().getTime()
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
          <div  className="flex gap-2 mt-0">
            <Link href={"/profile/"+props.handle} className="flex gap-[10px] mt-0">
      <img
        src={props.dp}
        alt="user profile"
        className="rounded-full object-cover min-w-[28px] max-w-[28px] h-7"
      />
    <div  className="flex items-center content-center">
      <h1>
        <p className="text-base font-medium text-gray-300 break-all line-clamp-1">{props.name}</p>
      </h1>
      <div className="mx-1 text-base text-gray-500">·</div>
      <span className="text-base font-medium text-gray-500 whitespace-nowrap">@{props.handle}</span>
      </div>
    </Link>
       <Menu type="quickie" id={props.id}  myhandle={props.myhandle} handle={props.handle}/>

  </div>

            <div>
          
            <Link
              href={'/quickie/'+props.id}
                style={{ wordBreak: "break-word", whiteSpace: "normal" }}
                className="mt-[6px] pl-0 ml-0 text-[18px] font-medium text-gray-300 four-line-ellipsis md:text-[17px]"
              >
                {formatText(props.description)}

             
              {photocount>0  &&
              <div className={photocount==1?"w-full border ml-0 rounded-md mt-4 aspect-video h-full mb-4":photocount==3?"mt-4 mb-4 md:gap-2 gap-1 grid thrip":"mt-4 mb-4 md:gap-2 gap-1 grid-cols-2 grid"}>
                {props.image.map((image:string) => 
                  <img onClick={()=>window.open(image,'_blank')?.focus()} className={`object-cover w-full border rounded-lg h-max ${props.image.length==2?'aspect-[8/10]':props.image.length==4?'aspect-video':'aspect-video'}`} src={image}></img>
                )}
              </div>
}

</Link>

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
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="m4 11.29l1-1v1.42l-1.15 1.14L3 12.5V10H1.5L1 9.5v-8l.5-.5h12l.5.5V6h-1V2H2v7h1.5l.5.5zM10.29 13l1.86 1.85l.85-.35V13h1.5l.5-.5v-5l-.5-.5h-8l-.5.5v5l.5.5zm.21-1H7V8h7v4h-1.5l-.5.5v.79l-1.15-1.14z"
              clipRule="evenodd"
            />
          </svg>{" "}
          <h1 className="text-sm">{props.comments}</h1>
        </Link>
        <span className="ml-auto"></span>

        <h1 className="text-[13px] font-medium text-gray-500 capitalize ">{props.time}</h1>



              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
