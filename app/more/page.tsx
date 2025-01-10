"use client";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { redirect } from "next/navigation";

import { useEffect, useRef, useState } from "react";
export default function Create() {
  const supabase = createClient();
  const hiddenFileInput = useRef<HTMLInputElement | any>();
  const hiddenProfileInput = useRef<HTMLInputElement | any>();
  const handleClick = () => {
    hiddenFileInput.current?.click();
  };
  const handleProfileClick = () => {
    hiddenProfileInput.current?.click();
  };
  const [changed, setChanged] = useState(false);
  const [changedprofile, setChangedProfile] = useState(false);
  const [file, setFile] = useState<any>();
  const [profile, setProfile] = useState<any>();
  async function coverChange() {
    console.log("here here");
    const bucket = "covers";

    // Call Storage API to upload file
    const { error } = await supabase.storage.from(bucket).upload("/public/" + handle + ".jpg", file, { upsert: true });

    // Handle error if upload failed
    if (error) {
      alert("Error uploading file.");
      return;
    } else {
      const { error: es } = await supabase
        .from("user")
        .update({
          cover: "https://xiexuntwvmedvyxokvvf.supabase.co/storage/v1/object/public/covers/public/" + handle + ".jpg",
        })
        .eq("handle", handle);
      if (es) {
        alert(es.message);
      }
      return;
    }
  }

  async function profileChange() {
    console.log("here here");
    const bucket = "profile";

    // Call Storage API to upload file
    const { error } = await supabase.storage
      .from(bucket)
      .upload("/public/" + handle + ".jpg", profile, { upsert: true });

    // Handle error if upload failed
    if (error) {
      alert("Error uploading file.");
      return;
    } else {
      const { error: es } = await supabase
        .from("user")
        .update({
          image: "https://xiexuntwvmedvyxokvvf.supabase.co/storage/v1/object/public/profile/public/" + handle + ".jpg",
        })
        .eq("handle", handle);
      if (es) {
        alert(es.message);
      }
      return;
    }
  }

  useEffect(() => {
    async function get() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        redirect("/login");
      } else {
        if (user) {
          const { data } = await supabase.from("user").select("*").eq("id", user.id);
          if (data) {
            setName(data[0]["name"]);
            setHandle(data[0]["handle"]);
            setAbout(data[0]["about"]);
            setImage(data[0]["image"] + "?" + new Date().getTime());
            setCover(data[0]["cover"] + "?" + new Date().getTime());
          }
        }
      }
    }
    get();
  }, []);

  const [handle, setHandle] = useState("");
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState("");
  const [cover, setCover] = useState("");

  async function create() {
    if (changed) {
      await coverChange();
    }
    if (changedprofile) {
      await profileChange();
    }
    const { error } = await supabase.from("user").update({ name: name, about: about }).eq("handle", handle);
    if (error) {
      console.log(error);
    } else {
      window.location.replace("/");
    }
  }
  return (
    <div
      className={`relative mx-auto flex h-[calc(100vh-104px)] flex-1 flex-col items-center justify-center overflow-hidden`}
    >
      <div className="absolute top-0 h-64 w-[calc(100%-20px)] max-w-full py-0 md:w-full md:px-4">
        <div className="relative h-64 w-[calc(100%)]">
          <div className="absolute top-0 h-[calc(52*4px)]  w-[calc(100%)] ">
            <Image
              width={200}
              height={200}
              src={cover ? cover : ""}
              className="rounded-md h-[calc(52*4px)] w-[calc(100%)] border border-neutral-500 object-cover "
              alt="cover"
            />
          </div>
          <div
            onClick={handleClick}
            className="absolute px-6 py-3 text-xs text-white rounded-md cursor-pointer left-2 top-2 w-max bg-black/60 drop-shadow-lg backdrop-blur-lg"
          >
            {" "}
            <input id="fupload" className="hidden" />
            Change Cover Picture
          </div>
          <div className="absolute inset-x-0 bottom-0">
            <div className="relative">
              <Image width={110} height={110} src={image} className="w-24 h-24 mx-auto rounded-lg " alt="image" />
              <div
                onClick={handleProfileClick}
                className="absolute text-xs flex items-center content-center text-white rounded-full cursor-pointer left-20 right-0 mx-auto top-[80%] w-7 h-7  bg-cyan-700 shadow-lg border border-white"
              >
                {" "}
                <svg
                  className="mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M3 17.46v3.04c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15L17.81 9.94l-3.75-3.75L3.15 17.1c-.1.1-.15.22-.15.36M20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75z"
                  />
                </svg>
                <input id="profileupload" className="hidden" />
                <input
                  onChange={(e: any) => {
                    setImage(URL.createObjectURL(e.target.files![0]));
                    setChangedProfile(true);
                    setProfile(e.target.files[0]);
                  }}
                  className="absolute inset-x-0 bottom-0 hidden mx-auto"
                  type="file"
                  ref={hiddenProfileInput}
                />
              </div>
            </div>
          </div>
          <input
            onChange={(e: any) => {
              setCover(URL.createObjectURL(e.target.files![0]));
              setChanged(true);
              setFile(e.target.files[0]);
            }}
            className="absolute inset-x-0 bottom-0 hidden mx-auto"
            type="file"
            ref={hiddenFileInput}
          />
        </div>
      </div>

      <form
        className="flex flex-col justify-center w-full max-w-lg gap-2 mx-auto mt-44 animate-in text-foreground md:mt-44 md:px-10"
        action={create}
      >
        <label className="mx-6 text-sm text-neutral-300" htmlFor="name">
          Name
        </label>
        <input
          onChange={(e) => setName(e.target.value)}
          className="px-4 py-2 mx-6 mb-4 text-sm text-white bg-black border rounded-md border-neutral-900"
          name="name"
          defaultValue={name}
          placeholder="Please Type Out Your Display Name"
          required
          minLength={4}
          maxLength={20}
        />

        <label className="mx-6 text-sm text-neutral-300" htmlFor="content">
          About
        </label>
        <textarea
          defaultValue={about}
          onChange={(e) => setAbout(e.target.value)}
          className="px-4 py-2 mx-6 mb-4 text-sm text-white bg-black border rounded-md border-neutral-900"
          name="content"
          placeholder="Please Type About Yourself"
          required
          minLength={24}
          maxLength={100}
        />

        <button className="px-8 py-4 mx-auto mb-2 text-xs font-medium text-white rounded-full bg-cyan-800 w-max">
          Save Your Changes
        </button>
      </form>
    </div>
  );
}
