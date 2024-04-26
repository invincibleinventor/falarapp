/* eslint-disable react/jsx-key */
"use client";
import { createClient } from "@/utils/supabase/client";
import "@mdxeditor/editor/style.css";

import { MouseEvent, useRef, useState } from "react";
import * as tus from 'tus-js-client'
function dateToYMD(date:Date) {
  const d = date.getDate();
  const m = date.getMonth() + 1; //Month from 0 to 11
  const y = date.getFullYear();
  return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
} 
export default function Create() {
  const [disabled,setDisabled] = useState(false)
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

const supabase = createClient()


async function uploadFile(bucketName:string, id:string, fileName:string, file:any) {
    const { data: session } = await supabase.auth.getSession()

    return new Promise<void>((resolve, reject) => {
        const upload = new tus.Upload(file, {
            endpoint: `https://${"xiexuntwvmedvyxokvvf"}.supabase.co/storage/v1/upload/resumable`,
            retryDelays: [0, 3000, 5000, 10000, 20000],
            headers: {
                authorization: `Bearer ${session.session?.access_token}`,
                'x-upsert': 'true', // optionally set upsert to true to overwrite existing files
            },
            uploadDataDuringCreation: true,
            removeFingerprintOnSuccess: true, // Important if you want to allow re-uploading the same file https://github.com/tus/tus-js-client/blob/main/docs/api.md#removefingerprintonsuccess
            metadata: {
                bucketName: bucketName,
                objectName: 'images/'+id+'/'+fileName,
                contentType: 'image/png',
            },
            chunkSize: 6 * 1024 * 1024, // NOTE: it must be set to 6MB (for now) do not change it
            onError: function (error) {
                console.log('Failed because: ' + error)
                alert(error)
                reject(error)
            },
            onProgress: function (bytesUploaded, bytesTotal) {
                const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)
                console.log(bytesUploaded, bytesTotal, percentage + '%')
            },
            onSuccess: function () {
              console.log('success')
                resolve()
            },
        })


        // Check if there are any previous uploads to continue.
        return upload.findPreviousUploads().then(function (previousUploads) {
            // Found previous uploads so we select the first one.
            if (previousUploads.length) {
                upload.resumeFromPreviousUpload(previousUploads[0])
            }

            // Start the upload
            upload.start()
        })
    })
}


const formatText = (text:string) => {
  console.log("text", text)
  const content = text.split(/((?:#|@|https?:\/\/[^\s]+)[a-zA-Z]+)/);
  let hashtag;
  const regex = /^[a-zA-Z]+$/;

  let tagarray:any = [];
  content.map((word) => {
      if (word.startsWith("#") && regex.test(word.slice(1,word.length-1))) {
          hashtag = word.replace('#', '')
          tagarray.push(hashtag)
      
      }
  });
  console.log(
    tagarray
  )
  return tagarray.reduce(function(a:any,b:any){if(a.indexOf(b)<0)a.push(b);return a;},[]);;
  

}

  async function publish(){
    setDisabled(true)
    let handle;
    const {data:user} = await supabase.auth.getUser()
    if(user.user){
    
      const { data: check } = await supabase
      .from("quickies")
      .select("*")
      .eq("poster", user.user.id)
      .order("id", { ascending: false })
      .limit(1);
      if(check && check.length>0 && check[0]["content"]==text)
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


      }
      else{
        const {data,error}  = await supabase.from('quickies').select('*').eq("poster", user?.user.id)
          .order("id", { ascending: false })
          .limit(1);
         
          if(data && !error){
            const id = data[0]["id"]
            const hashtags = formatText(text)
            if(hashtags.length>0){
            for(let i = 0;i<hashtags.length;i++){
              const {data,error} = await supabase.from('hashtags').select('*').eq('hashtag',hashtags[i])
              if(error){
                console.log(error)
              }
              else{ if (data && data.length>0){
               const posts = data[0]["posts"]
               
               posts.push(id)
               const {error}  = await supabase.from('hashtags').upsert({posts:posts,id:data[0]["id"],hashtag:hashtags[i],postcount:posts.length})
                if(error){
                  console.log('roeks')
                  console.log(error)
                }
                else{
                  const date = new Date().toLocaleDateString('en-IN',  { year: 'numeric', month: '2-digit', day: '2-digit' });
                  const hour = new Date().getHours()
                  console.log('ingaye')
                  const {data,error} = await supabase.from('trending').select('*').eq('date',date)
                  let a:any;
                    let h;
                    if(hour>=0 && hour<3){
                     h=0
                    }
                    else if(hour>=3 && hour<6){
                      h=3
                     }
                     else if(hour>=6 && hour<9){
                      h=6
                     }
                     else if(hour>=9 && hour<12){
                      h=9
                     }
                     else if(hour>=12 && hour<15){
                      h=12
                     }
                     else if(hour>=15 && hour<18){
                      h=15
                     }
                     else if(hour>=18 && hour<21){
                      h=18
                     }
                     else{
                      h=21
                     }
                     if(error){
                      alert(error)
                        console.log(error)
                       
                     }
                     else{
                  if(data && data.length>0){
                    a=data[0][h]  
                     if(Object.keys(a).includes(hashtags[i]))
                     {
                      a[hashtags[i]]=a[hashtags[i]]+1
                      console.log(a)
                      const {error} = await supabase.from('trending').update({[h]:a}).eq('date',date)
                      if(!error){
                        window.location.replace('/quickies')
                      }
                      else{
                        console.log(error)
                       }
                    }
                     else{
                      console.log(a)
                      console.log('ingathaan')
                      a[hashtags[i]]=1
                      console.log(a)
                      const {error} = await supabase.from('trending').update({[h]:a}).eq('date',date)
                      if(!error){
                        window.location.replace('/quickies')
                      }
                      else{
                        console.log(error)
                      }
                     }
                     
                     
                     
                  }
                  else{
                    
                    a={}
                   
                     a[hashtags[i]]=1
                     console.log(a)
                     const {error} = await supabase.from('trending').insert({'date':date,[h]:a})
                     if(!error){
                       window.location.replace('/quickies')
                     }
                       else{
                      console.log(error)
                     }
                     }
                     
                    }
                  
                }
                }
               
              
              else{
                const posts = []
                posts.push(id)
                const {error}  = await supabase.from('hashtags').upsert({posts:posts,hashtag:hashtags[i],postcount:posts.length})
                if(error){
                  console.log(error)
                }
                else{
                  const date = new Date().toLocaleDateString('en-IN',  { year: 'numeric', month: '2-digit', day: '2-digit' });
            
                     const hour = new Date().getHours()
                  console.log('ok')
                  const {data,error} = await supabase.from('trending').select('*').eq('date',date)
                  console.log('ingaye out uh')
                  let a:any;
                    let h;
                    if(hour>=0 && hour<3){
                     h=0
                    }
                    else if(hour>=3 && hour<6){
                      h=3
                     }
                     else if(hour>=6 && hour<9){
                      h=6
                     }
                     else if(hour>=9 && hour<12){
                      h=9
                     }
                     else if(hour>=12 && hour<15){
                      h=12
                     }
                     else if(hour>=15 && hour<18){
                      h=15
                     }
                     else if(hour>=18 && hour<21){
                      h=18
                     }
                     else{
                      h=21
                     }
                     if(error){
                      console.log(error)
                     }
                     else{
                      console.log('good to go')
                  if(data && data.length>0){
                    a=data[0][h]
                     if(hashtags[i] in a)
                     {
                      a[hashtags[i]]=a[hashtags[i]]+1
                      const {error} = await supabase.from('trending').update({[h]:a}).eq('date',date)
                      if(!error){
                        window.location.replace('/quickies')
                      }
                      else{
                        console.log(error)
                       }
                    }
                     else{
                      a[hashtags[i]]=1
                      const {error} = await supabase.from('trending').update({[h]:a}).eq('date',date)
                      if(!error){
                        window.location.replace('/quickies')
                      }
                      else{
                        console.log(error)
                       }
                     }
                     
                     
                     
                  }
                  else{
                    
                    a={}
                   
                     a[hashtags[i]]=1
                     const {error} = await supabase.from('trending').insert({date:date,[h]:a})
                     if(!error){
                       window.location.replace('/quickies') }
                      else{
                        console.log(error)
                       }
                     }
                    
                    }
                  
                }
              }
            
            }
          }

            }
            

        if(imgsSrc.length>0){
          
            for(let i =0;i<imgsSrc.length;i++){
              console.log(imgsSrc[i])

            
              const file = dataURLtoFile(imgsSrc[i],[i]+'.jpg')
              
              
              const bucket = "quickies"
              uploadFile(bucket,id,i + ".jpg",file).then(async()=>{
              
                const imgarray = []
                for(let j = 0;j<imgsSrc.length;j++){
                  imgarray.push("https://xiexuntwvmedvyxokvvf.supabase.co/storage/v1/object/public/quickies/images/"+id+'/'+j+'.jpg')
                }
                const {error} = await supabase.from('quickies').update({image:imgarray}).eq('id',id)
              if(error){
                console.log(error)

                
              }
              else{
                window.location.replace('/quickies')

              }
            })
              
            }
          }
          
        }
        else{
          window.location.replace('/quickies')
        }
      }
     
    }
    }
  }
  }
    const [imgsSrc, setImgsSrc] = useState<any[]>([]);
    const onChange = (e:any) => {
    
      for (const file of e.target.files) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          console.log(imgsSrc.length)
          if (imgsSrc.length > 3) {
            alert("Only 4 files accepted.");
            e.preventDefault();
        }else{
          setImgsSrc((imgs:any) => [...imgs, reader.result]);
        }
        };
        reader.onerror = () => {
          console.log(reader.error);
        };
      }
    
    };
  return(
  <div className="flex  h-screen w-[calc(100vw-68px)] bg-gray-900/20 flex-col content-center items-start md:w-full">
    <div className="flex flex-row w-full bg-black border-b border-b-gray-900">
              <h1 className="px-2 mx-4 my-6 text-xl font-semibold text-gray-300 md:font-bold md:text-xl">New Quickie</h1>
              <button className="ml-auto mr-6 " onClick={(e:any)=>handleClick(e)}><svg xmlns="http://www.w3.org/2000/svg" className="text-gray-300" width="1.5em" height="1.5em" viewBox="0 0 20 20"><path fill="currentColor" d="M10 5.5a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0m-4-2a.5.5 0 0 0-1 0V5H3.5a.5.5 0 0 0 0 1H5v1.5a.5.5 0 0 0 1 0V6h1.5a.5.5 0 0 0 0-1H6zm8 .5h-3.207a5.466 5.466 0 0 0-.393-1H14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-3.6c.317.162.651.294 1 .393V14c0 .373.102.722.28 1.02l4.669-4.588a1.5 1.5 0 0 1 2.102 0l4.67 4.588A1.99 1.99 0 0 0 16 14V6a2 2 0 0 0-2-2m0 3.5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m-1 0a.5.5 0 1 0-1 0a.5.5 0 0 0 1 0m-8.012 8.226A1.99 1.99 0 0 0 6 16h8c.37 0 .715-.1 1.012-.274l-4.662-4.58a.5.5 0 0 0-.7 0z"/></svg></button>

</div>
    <textarea onChange={(e:any)=>setText(e.target.value)} maxLength={150} className="w-full h-full px-6 py-5 mb-auto text-gray-300 bg-transparent outline-none resize-none text-md md:text-lg placeholder:text-gray-600 md:m-4 md:p-0 md:px-2" placeholder="What's on your mind?">
        
    </textarea>
    <div className="grid w-full grid-cols-3 px-4 mb-20 border-t bg-black/40 border-t-gray-900 sm:flex sm:flex-row ">
    {imgsSrc.map((link,index) => (
        <div key={index} className="relative my-4  sm:mx-4   mx-auto  aspect-[16/10] w-24  content-center items-center">
          <button onClick={()=>(setarr(link))} className="absolute top-0 flex items-center content-center w-4 h-4 font-medium text-white bg-red-700 rounded-full shadow-md right-2"><h1 className="mx-auto">-</h1></button>
        <img className=" aspect-[16/10] w-20 object-cover" key={index} src={link} />
        </div>
      ))}
    </div>
    <div className="absolute bottom-0 flex flex-row items-center content-center w-full h-20 px-4 pl-4 bg-black border-t border-t-gray-900 ">
        
        <input             ref={hiddenFileInput}
  type="file" className="hidden" onChange={onChange} accept="image/png, image/jpeg, image/jpg, image/gif" name="file" multiple />
             <button disabled={disabled} onClick={()=>publish()} className="px-6 py-3 ml-auto text-xs font-medium text-white bg-blue-700 rounded-full md:mr-6 lg:mr-2">Publish</button>

    </div>
  </div>
  )
}
