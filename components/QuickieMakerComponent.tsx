/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-key */
"use client";
import { AppConfig } from "@/config/config";
import notification from "@/utils/notifications/notification";
import { createClient } from "@/utils/supabase/client";
import "@mdxeditor/editor/style.css";
import GifPicker, {Theme} from "gif-picker-react"

import { MouseEvent, useEffect, useRef, useState } from "react";
import * as tus from "tus-js-client";

export default function QuickieMakerComponent(props: any) {
  const [disabled, setDisabled] = useState(false);
  const [date, setDate] = useState<any>();
  const [hour, setHour] = useState<any>();
  const [gifpicked, setGifPicked] = useState(false);
  const [gifurl,setGifUrl]  = useState('')
  const [gif,showGif] = useState<any>(true);
    const [text, setText] = useState("");
  const hiddenFileInput = useRef<HTMLInputElement | null>(null);
  const handleClick = (event: MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setGifPicked(false);
    let arr = imgsSrc;
    if(imgsSrc.includes(gifurl)){
      arr = arr.filter(function(item) {
        return item !== gifurl
    })
    setImgsSrc(arr)
    
    }
    hiddenFileInput!.current!.click();
  };
  function setarr(index: string) {
    const a: any = imgsSrc;
    const b = a.filter(function (letter: string) {
      return letter !== index;
    });
    setImgsSrc(b);
  }
  useEffect(() => {
    const d = new Date().toLocaleDateString("en-IN");
    console.log(d);
    const s = d.split("/");

    const year = s[2];
    const month = s[1];
    const da = s[0];
    const sa = year + "/" + month + "/" + da;
    setDate(sa);
    const h = new Date().getHours();
    setHour(h);
  }, []);
  function dataURLtoFile(dataurl: any, filename: any) {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[arr.length - 1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  const supabase = createClient();

  async function uploadFile(bucketName: string, id: string, fileName: string, file: any) {
    const { data: session } = await supabase.auth.getSession();

    return new Promise<void>((resolve, reject) => {
      const upload = new tus.Upload(file, {
        endpoint: `https://${"xiexuntwvmedvyxokvvf"}.supabase.co/storage/v1/upload/resumable`,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        headers: {
          authorization: `Bearer ${session.session?.access_token}`,
          "x-upsert": "true", // optionally set upsert to true to overwrite existing files
        },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true, // Important if you want to allow re-uploading the same file https://github.com/tus/tus-js-client/blob/main/docs/api.md#removefingerprintonsuccess
        metadata: {
          bucketName: bucketName,
          objectName: "images/" + id + "/" + fileName,
          contentType: "image/png",
        },
        chunkSize: 6 * 1024 * 1024, // NOTE: it must be set to 6MB (for now) do not change it
        onError: function (error) {
          console.log("Failed because: " + error);
          alert(error);
          reject(error);
        },
        onProgress: function (bytesUploaded, bytesTotal) {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          console.log(bytesUploaded, bytesTotal, percentage + "%");
        },
        onSuccess: function () {
          console.log("success");
          resolve();
        },
      });

      return upload.findPreviousUploads().then(function (previousUploads) {
        if (previousUploads.length) {
          upload.resumeFromPreviousUpload(previousUploads[0]);
        }

        upload.start();
      });
    });
  }
  let mentionarray: any = [];

  const formatText = (text: string) => {
    console.log("text", text);
    const content = text.split(/((?:#|@)[a-zA-Z][a-zA-Z0-9]*|https?:\/\/[^\s]+)/);
    let hashtag;
    const regex = /^[a-zA-Z]+$/;
    let mention;
    const tagarray: any = [];
    content.map((word) => {
      if (word.startsWith("#") && regex.test(word.slice(1, word.length - 1))) {
        hashtag = word.replace("#", "");
        tagarray.push(hashtag);
      }
      if (word.startsWith("@") && regex.test(word.slice(1, word.length - 1))) {
        mention = word.replace("@", "");
        mentionarray.push(mention);
      }
    });
    console.log(tagarray);
    return tagarray.reduce(function (a: any, b: any) {
      if (a.indexOf(b) < 0) a.push(b);
      return a;
    }, []);
  };
  
  
  async function publish() {
    setDisabled(true);
    let handle: string;
    let image: any;
    const { data: user } = await supabase.auth.getUser();
    if (user.user) {
      if (1 == 1) {
        const { data, error } = await supabase.from("user").select("*").eq("id", user.user.id);
        if (!error && data) {
          handle = data[0]["handle"];
          image = data[0]["image"];
          
          const arr = text.match(/(?:#|@)[a-zA-Z][a-zA-Z0-9]*|https?:\/\/[^\s]+/g) || [];

          for(let i = 0; i < arr.length; i++){
            if(arr[i].startsWith("@")){
              mentionarray.push(arr[i].slice(1, arr[i].length));
            }
          }
         mentionarray.push(handle);
         mentionarray = Array.from(new Set(mentionarray));
        
          const { error } = await supabase.from("quickies").insert({involved: mentionarray, handle: handle, content: text });
          if (error) {
            console.log("initial");
            console.log(error);
          } else {
            const { data, error } = await supabase
              .from("quickies")
              .select("*")
              .eq("poster", user?.user.id)
              .order("id", { ascending: false })
              .limit(1);

            if (data && !error) {
              const id = data[0]["id"];

              const filteredMentions = Array.from(
                new Set(mentionarray.filter((mention: any) => mention !== handle))
              );
              await Promise.all(
                filteredMentions.map(async (mention: any) => {
                  const { data: us, error } = await supabase.from("user").select("*").eq("handle", mention);
                  if (us && us.length > 0) {
                    return notification(
                      [],
                      supabase,
                      us[0].id,
                      "/quickie/" + id,
                      "@" + handle + " tagged you in a quickie\n",
                      "mention",
                      user.user.id,
                      data[0]["content"],
                      image
                    );
                  }
                })
              );

             
              const hashtags = formatText(text);
              if (hashtags.length > 0) {
                for (let i = 0; i < hashtags.length; i++) {
                  const { data, error } = await supabase.from("hashtags").select("*").eq("hashtag", hashtags[i]);
                  if (error) {
                    console.log(error);
                  } else {
                    if (data && data.length > 0) {
                      const posts = data[0]["posts"];

                      posts.push(id);
                      const { error } = await supabase
                        .from("hashtags")
                        .upsert({ posts: posts, id: data[0]["id"], hashtag: hashtags[i], postcount: posts.length });
                      if (error) {
                        console.log("roeks");
                        console.log(error);
                      } else {
                        console.log("ingaye");
                        const { data, error } = await supabase.from("trending").select("*").eq("date", date);
                        let a: any;
                        let h;
                        if (hour >= 0 && hour < 3) {
                          h = 0;
                        } else if (hour >= 3 && hour < 6) {
                          h = 3;
                        } else if (hour >= 6 && hour < 9) {
                          h = 6;
                        } else if (hour >= 9 && hour < 12) {
                          h = 9;
                        } else if (hour >= 12 && hour < 15) {
                          h = 12;
                        } else if (hour >= 15 && hour < 18) {
                          h = 15;
                        } else if (hour >= 18 && hour < 21) {
                          h = 18;
                        } else {
                          h = 21;
                        }
                        if (error) {
                          alert(error);
                          console.log(error);
                        } else {
                          if (data && data.length > 0) {
                            a = data[0][h];
                            if (Object.keys(a).includes(hashtags[i])) {
                              a[hashtags[i]] = a[hashtags[i]] + 1;
                              console.log(a);
                              const { error } = await supabase
                                .from("trending")
                                .update({ [h]: a })
                                .eq("date", date);
                              if (error) {
                                console.log(error);
                              }
                            } else {
                              console.log(a);
                              console.log("ingathaan");
                              a[hashtags[i]] = 1;
                              console.log(a);
                              const { error } = await supabase
                                .from("trending")
                                .update({ [h]: a })
                                .eq("date", date);
                              if (error) {
                                console.log(error);
                              }
                            }
                          } else {
                            a = {};

                            a[hashtags[i]] = 1;
                            console.log(a);
                            const { error } = await supabase.from("trending").insert({ date: date, [h]: a });
                            if (error) {
                              console.log(error);
                            }
                          }
                        }
                      }
                    } else {
                      const posts = [];
                      posts.push(id);
                      const { error } = await supabase
                        .from("hashtags")
                        .upsert({ posts: posts, hashtag: hashtags[i], postcount: posts.length });
                      if (error) {
                        console.log(error);
                        alert(error.message);
                      } else {
                        console.log("ok");
                        const { data, error } = await supabase.from("trending").select("*").eq("date", date);
                        console.log("ingaye out uh");
                        let a: any;
                        let h;
                        if (hour >= 0 && hour < 3) {
                          h = 0;
                        } else if (hour >= 3 && hour < 6) {
                          h = 3;
                        } else if (hour >= 6 && hour < 9) {
                          h = 6;
                        } else if (hour >= 9 && hour < 12) {
                          h = 9;
                        } else if (hour >= 12 && hour < 15) {
                          h = 12;
                        } else if (hour >= 15 && hour < 18) {
                          h = 15;
                        } else if (hour >= 18 && hour < 21) {
                          h = 18;
                        } else {
                          h = 21;
                        }
                        if (error) {
                          console.log(error);
                          alert(error.message);
                        } else {
                          console.log("good to go");
                          if (data && data.length > 0) {
                            a = data[0][h];
                            if (hashtags[i] in a) {
                              a[hashtags[i]] = a[hashtags[i]] + 1;
                              const { error } = await supabase
                                .from("trending")
                                .update({ [h]: a })
                                .eq("date", date);
                              if (error) {
                                console.log(error);
                                alert(error.message);
                              }
                            } else {
                              a[hashtags[i]] = 1;
                              const { error } = await supabase
                                .from("trending")
                                .update({ [h]: a })
                                .eq("date", date);
                              if (error) {
                                console.log(error);
                                alert(error.message);
                              }
                            }
                          } else {
                            a = {};

                            a[hashtags[i]] = 1;
                            const { error } = await supabase.from("trending").insert({ date: date, [h]: a });
                            if (error) {
                              console.log(error);
                              alert(error.message);
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
              if(gifpicked) {
                setImgsSrc([]);
                let arr = [];
                arr.push(gifurl)
                const { error } = await supabase.from("quickies").update({ image: arr}).eq("id", id);
                if (error) {
                  console.log(error);
                  alert(error.message);
                } else {
                  window.location.replace("/quickies");
                }
              }

              else if (imgsSrc.length > 0) {
                setGifPicked(false);
                for (let i = 0; i < imgsSrc.length; i++) {
                  console.log(imgsSrc[i]);

                  const file = dataURLtoFile(imgsSrc[i], [i] + ".jpg");

                  const bucket = "quickies";
                  uploadFile(bucket, id, i + ".jpg", file).then(async () => {
                    const imgarray = [];
                    for (let j = 0; j < imgsSrc.length; j++) {
                      imgarray.push(
                        "https://xiexuntwvmedvyxokvvf.supabase.co/storage/v1/object/public/quickies/images/" +
                          id +
                          "/" +
                          j +
                          ".jpg"
                      );
                    }
                    const { error } = await supabase.from("quickies").update({ image: imgarray }).eq("id", id);
                    if (error) {
                      console.log(error);
                      alert(error.message);
                    } else {
                      window.location.replace("/quickies");
                    }
                  });
                }
              } else {
                window.location.replace("/quickies");
              }
            } else {
              window.location.replace("/quickies");
            }
          }
        }
      }
    }
  }
  const [imgsSrc, setImgsSrc] = useState<any[]>([]);
  const onChange = (e: any) => {
    for (const file of e.target.files) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        console.log(imgsSrc.length);
        if (imgsSrc.length > 3) {
          alert("Only 4 files accepted.");
          e.preventDefault();
        } else {
          setImgsSrc((imgs: any) => [...imgs, reader.result]);
        }
      };
      reader.onerror = () => {
        console.log(reader.error);
      };
    }
  };
  function handleGif(gif:any){
      setGifPicked(true);
      setGifUrl(gif);
      let arr = [];
      arr.push(gif);
      setImgsSrc(arr);
  }
  return (
    <div className="lg:flex-row flex flex-col lg:min-h-[80px] bg-white/10 min-w-[300px] animate-in min-h-[400px] xl:mr-[400px] shadow-lg border border-neutral-900 rounded-2xl mx-auto ">
     
      <div className={`flex relative flex-col content-center items-start rounded-2xl lg:w-[544px] lg:min-h-[80px] min-h-[400px] ${AppConfig.customtheme?AppConfig.custombg:'bg-primary-950/80'} ${gif?'rounded-r-none':'rounded-r-lg'}`}>
        <div className={`flex flex-row w-full bg-opacity-20 bg-white/20  rounded-tl-2xl h-[70px] ${gif?'rounded-tr-2xl md:rounded-r-none md:rounded-tr-none':'rounded-t-2xl'}`}>
          <h1 className="px-2 mx-4 my-auto h-[70px] flex items-center content-center text-lg font-semibold text-neutral-300">New Quickie</h1>
          <button className="mr-2 ml-auto" onClick={(e: any) => handleClick(e)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
              width="2em"
              height="2em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M10 5.5a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0m-4-2a.5.5 0 0 0-1 0V5H3.5a.5.5 0 0 0 0 1H5v1.5a.5.5 0 0 0 1 0V6h1.5a.5.5 0 0 0 0-1H6zm8 .5h-3.207a5.466 5.466 0 0 0-.393-1H14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-3.6c.317.162.651.294 1 .393V14c0 .373.102.722.28 1.02l4.669-4.588a1.5 1.5 0 0 1 2.102 0l4.67 4.588A1.99 1.99 0 0 0 16 14V6a2 2 0 0 0-2-2m0 3.5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m-1 0a.5.5 0 1 0-1 0a.5.5 0 0 0 1 0m-8.012 8.226A1.99 1.99 0 0 0 6 16h8c.37 0 .715-.1 1.012-.274l-4.662-4.58a.5.5 0 0 0-.7 0z"
              />
            </svg>
            
         </button>
         <svg onClick={()=>showGif(!gif)} className="my-auto mr-6 text-white" width="2em" height="2em" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M11.98 14.712q.191 0 .317-.126t.126-.317v-4.5q0-.19-.126-.316t-.316-.126t-.316.126t-.126.316v4.5q0 .19.126.317t.316.126m-4.404 0h1.385q.502 0 .847-.346q.345-.345.345-.847v-.903q0-.191-.126-.317t-.316-.126t-.317.126t-.126.317v.788q0 .173-.125.298t-.298.125H7.692q-.173 0-.298-.125t-.125-.298v-2.77q0-.172.125-.297t.298-.125h2.02q.19 0 .316-.126t.126-.317t-.126-.316t-.316-.126H7.577q-.502 0-.847.345t-.345.847v3q0 .502.345.847q.345.346.847.346m6.789 0q.19 0 .316-.126t.126-.317v-1.711h1.48q.19 0 .317-.126t.126-.316t-.126-.317t-.317-.126h-1.48v-1.461h2.48q.19 0 .317-.126t.126-.317t-.126-.316t-.317-.126h-2.922q-.191 0-.317.126t-.126.316v4.5q0 .19.126.316t.317.126M5.616 20q-.691 0-1.153-.462T4 18.384V5.616q0-.691.463-1.153T5.616 4h12.769q.69 0 1.153.463T20 5.616v12.769q0 .69-.462 1.153T18.384 20zm0-1h12.769q.23 0 .423-.192t.192-.424V5.616q0-.231-.192-.424T18.384 5H5.616q-.231 0-.424.192T5 5.616v12.769q0 .23.192.423t.423.192M5 19V5z"/></svg>
        
        </div>
        <textarea
          onChange={(e: any) => setText(e.target.value)}
          maxLength={150}
          className="px-6 py-5 pr-5 mb-auto w-full h-full bg-transparent outline-none resize-none text-neutral-300 md:pr-6 hiddenscroll lg:pr-10 text-md md:text-lg placeholder:text-neutral-500 md:m-4 md:p-0 md:px-2"
          placeholder="What's on your mind?"
        ></textarea>
        <div className="grid grid-cols-3 px-4 mb-20 w-full bg-transparent sm:flex sm:flex-row">
          {imgsSrc.map((link, index) => (
            <div
              key={index}
              className="relative my-4  sm:mx-4   mx-auto  aspect-[16/10] w-24  content-center items-center"
            >
              <button
                onClick={() => setarr(link)}
                className="flex absolute top-0 right-2 content-center items-center w-4 h-4 font-medium text-white bg-red-700 rounded-full shadow-md"
              >
                <h1 className="mx-auto">-</h1>
              </button>
              <img className=" aspect-[16/10] rounded-lg w-20 object-cover" key={index} src={link} />
            </div>
          ))}
        </div>
        <div className="flex absolute bottom-0 z-10 flex-row flex-grow content-center items-center px-4 pl-4 w-full h-20 rounded-b-none border-b md:rounded-br-none border-b-neutral-950">
          <input
            ref={hiddenFileInput}
            type="file"
            className="hidden"
            onChange={onChange}
            accept="image/png, image/jpeg, image/jpg, image/gif"
            name="file"
            multiple
          />
          <h1 onClick={() => props.stateChanger(false)} className="ml-2 text-base text-red-500 cursor-pointer">
            Cancel
          </h1>
          <button
            disabled={disabled}
            onClick={() => publish()}
            className="px-6 py-3 ml-auto text-sm font-medium text-white rounded-full font-pops bg-primary-700 md:mr-6 lg:mr-2"
          >
            Publish
          </button>
        </div>
      </div>
      <div className={gif?"block":"hidden"}>
         <GifPicker theme={Theme.DARK} onGifClick={(gif)=>handleGif(gif.url)}  tenorApiKey={'AIzaSyAjudoqhS67M8SXNrdrcGxuXnBCtnvg2Ho'}/>
          </div>
    </div>
  );
}
