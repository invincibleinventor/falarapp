"use client";
import { AppConfig } from "@/config/config";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";

import { useEffect, useState } from "react";
export default function Create() {
  const supabase = createClient();

  useEffect(() => {
    async function get() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        window.location.replace("/login");
      } else {
        if (user) {
          const { data } = await supabase.from("user").select("*").eq("id", user.id);
          if (data && data.length > 0) {
            window.location.replace("/");
          } else {
            if (user.email) {
              setEmail(user.email);
              setImage(user.user_metadata.avatar_url);
            }
          }
        }
      }
    }
    get();
  });

  const [handle, setHandle] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState("");

  async function create() {
    const checkHandleExists = async (handle: string) => {
      try {
        const { data, error } = await supabase.rpc("check_handle_existence", { p_handle: handle });

        if (error) {
          throw error;
        }

        return data.length > 0;
      } catch (error) {
        console.error("Error checking handle existence:", error);
        throw error;
      }
    };
    const exists = await checkHandleExists(handle);

    if (exists) {
      alert("This username cannot be used. Please try a different username.");
    } else {
      const { error } = await supabase.from("user").insert({
        email: email,
        name: name,
        cover: "/bgcover.jpg",
        handle: handle.toLowerCase(),
        about: about,
        image: image,
        followers: [],
        following: [AppConfig.officialaccount],
        bookmarks: [],
        liked: [],
        private: false,
      });
      if (error) {
        console.log(error);
      } else {
        const { data: d } = await supabase.from("user").select("*").eq("handle", AppConfig.officialaccount);
        if (d && d.length > 0) {
          const ls = d[0]["followers"];
          ls.push(handle.toLowerCase());
          const { error: es } = await supabase
            .from("user")
            .update({ followers: ls })
            .eq("handle", AppConfig.officialaccount);
          if (es) {
            console.log(es);
          } else {
            window.location.replace("/");
          }
        }
      }
    }
  }
  return (
    <div className={`mx-auto flex h-screen w-full max-w-lg flex-col items-center justify-center px-10 `}>
      <form
        className="flex flex-col justify-center w-full gap-2 my-auto ml-auto animate-in text-foreground"
        action={create}
      >
        <h1 className="text-2xl font-semibold text-white">Welcome To {AppConfig.title}</h1>
        <h1 className="pb-10 text-base font-normal text-neutral-400 ">
          Let us setup your profile on {AppConfig.title}. Setup your profile to continue.
        </h1>
        <label className="text-sm text-neutral-300" htmlFor="name">
          Name
        </label>
        <input
          onChange={(e) => setName(e.target.value)}
          className="px-4 py-2 mb-6 text-sm bg-black border rounded-md outline-none text-neutral-300 border-neutral-900 focus:outline-cyan-800"
          name="name"
          placeholder="Please Type Out Your Name"
          required
          minLength={4}
          maxLength={20}
        />
        <label className="text-sm text-neutral-300" htmlFor="name">
          Username - You cannot change this later
        </label>
        <input
          onChange={(e) => setHandle(e.target.value.trim().replace(" ", "_"))}
          className="px-4 py-2 mb-6 text-sm bg-black border rounded-md outline-none text-neutral-300 border-neutral-900 focus:outline-cyan-800"
          name="handle"
          placeholder="Please Type Out Your Username"
          required
          minLength={4}
          maxLength={12}
        />
        <label className="text-sm text-neutral-300" htmlFor="content">
          About
        </label>
        <textarea
          onChange={(e) => setAbout(e.target.value)}
          className="px-4 py-2 mb-6 text-sm bg-black border rounded-md outline-none text-neutral-300 border-neutral-900 focus:outline-cyan-800"
          name="content"
          placeholder="Please Type About Yourself"
          required
          minLength={4}
          maxLength={100}
        />

        <button className="px-8 py-4 mx-auto mb-2 text-xs font-medium text-white rounded-full bg-cyan-800 w-max">
          Setup Your Account
        </button>
      </form>
    </div>
  );
}
