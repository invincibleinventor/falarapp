"use client";
import { createClient } from "@/utils/supabase/client";
import "@mdxeditor/editor/style.css";
import MDEditor from "@uiw/react-md-editor";
import Image from "next/image";
import { redirect } from "next/navigation";
import { MouseEvent, useRef, useState } from "react";
import rehypeSanitize from "rehype-sanitize";

export default function Create() {
  const [text,setText] = useState('')
    const hiddenFileInput = useRef<HTMLInputElement | null>(null);
  const handleClick = (event: MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    hiddenFileInput!.current!.click();
  };
  function setarr(index:string){
    const a:any = imgsSrc
    const b = a.filter(function (letter:string) {
      return letter !== index;
  });
  setImgsSrc(b)
    
  }
  function dataURLtoFile(dataurl:any, filename:any) {
    let arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[arr.length - 1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}
  async function publish(){
    const supabase = createClient()
    let handle;
    const {data:user} = await supabase.auth.getUser()
    if(user.user){
    
      const { data: check } = await supabase
      .from("quickies")
      .select("*")
      .eq("poster", user.user.id)
      .order("id", { ascending: false })
      .limit(1);
      if(check && check[0]["content"]==text)
      {
        window.location.replace('/quickies')
      }
      else{
    const {data,error} = await supabase.from('user').select('*').eq('id',user.user.id)
    if(!error && data){
      handle=data[0]["handle"]
      const {error}  = await supabase.from('quickies').insert({handle:handle,content:text})
      if(error){
        console.log('initial')
        console.log(error)

        alert(error)

      }
      else{
        if(imgsSrc.length>0){
          const {data,error}  = await supabase.from('quickies').select('*').eq("poster", user?.user.id)
          .order("id", { ascending: false })
          .limit(1);
         
          if(data && !error){
            const id = data[0]["id"]
            for(let i =0;i<imgsSrc.length;i++){
              console.log(imgsSrc[i])

            
              const file = dataURLtoFile(imgsSrc[i],[i]+'.jpg')
              
              const bucket = "quickies"
              const {error} = await supabase.storage.from(bucket).upload("/images/" + [id] + '/'+ [i] + ".jpg", file, { upsert: true });
              if(error){
                console.log(error)

                alert(error)
              }
              else{
                const imgarray = []
                for(let j = 0;j<imgsSrc.length;j++){
                  imgarray.push("https://xiexuntwvmedvyxokvvf.supabase.co/storage/v1/object/public/quickies/images/"+id+'/'+j+'.jpg')
                }
                const {error} = await supabase.from('quickies').update({image:imgarray}).eq('id',id)
              if(error){
                console.log(error)
                alert(error)
                
              }
              else{
                window.location.replace('/quickies')
              }
              }
            }
          }
          
        }
        else{
          window.location.replace('/')
        }
      }
    }
    }
  }
  }
    const [imgsSrc, setImgsSrc] = useState([]);
    const onChange = (e:any) => {
      for (const file of e.target.files) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          setImgsSrc((imgs:any) => [...imgs, reader.result]);
        };
        reader.onerror = () => {
          console.log(reader.error);
        };
      }
    };
  return(
  <div className="flex  w-[calc(100vw-68px)] flex-col items-start md:w-full content-center h-screen">
              <h1 className="mx-4 md:mb-2 text-3xl font-bold text-black mt-4 md:mt-[calc(18*4px)] md:text-3xl">New Quickie</h1>

    <textarea onChange={(e:any)=>setText(e.target.value)} maxLength={150} className="w-full h-full px-4 py-5 mb-auto text-xl bg-transparent outline-none resize-none md:py-0 md:px-0 placeholder:text-gray-600 md:m-4" placeholder="What's on your mind?">
        
    </textarea>
    <div className="flex flex-row w-full px-4 space-x-4">
    {imgsSrc.map((link,index) => (
        <div key={index} className="relative flex items-center content-center w-24 mb-20 aspect-[16/10]">
          <button onClick={()=>(setarr(link))} className="absolute top-0 right-0 flex items-center content-center w-4 h-4 font-medium text-white bg-red-700 rounded-full shadow shadow-mdo"><h1 className="mx-auto">-</h1></button>
        <img className="w-20 mx-auto aspect-[16/10]" key={index} src={link} />
        </div>
      ))}
    </div>
    <div className="absolute bottom-0 flex flex-row items-center content-center w-full h-16 px-6 ml-4 ">
        
        <button className="ml-auto mr-6 " onClick={(e:any)=>handleClick(e)}><svg xmlns="http://www.w3.org/2000/svg" className="text-gray-800" width="2em" height="2em" viewBox="0 0 20 20"><path fill="currentColor" d="M10 5.5a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0m-4-2a.5.5 0 0 0-1 0V5H3.5a.5.5 0 0 0 0 1H5v1.5a.5.5 0 0 0 1 0V6h1.5a.5.5 0 0 0 0-1H6zm8 .5h-3.207a5.466 5.466 0 0 0-.393-1H14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-3.6c.317.162.651.294 1 .393V14c0 .373.102.722.28 1.02l4.669-4.588a1.5 1.5 0 0 1 2.102 0l4.67 4.588A1.99 1.99 0 0 0 16 14V6a2 2 0 0 0-2-2m0 3.5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m-1 0a.5.5 0 1 0-1 0a.5.5 0 0 0 1 0m-8.012 8.226A1.99 1.99 0 0 0 6 16h8c.37 0 .715-.1 1.012-.274l-4.662-4.58a.5.5 0 0 0-.7 0z"/></svg></button>
        <input             ref={hiddenFileInput}
  type="file" className="hidden" onChange={onChange} accept="image/png, image/jpeg, image/jpg, image/gif" name="file" multiple />
             <button onClick={()=>publish()} className="px-6 py-3 text-sm text-white bg-black">Publish</button>

    </div>
  </div>
  )
}
