"use server";

import { AppConfig } from "@/config/config";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createUser(formData: FormData) {
  const supabase = createClient(cookies());

  const email = formData.get("email") as string;
  const image = formData.get("image") as string;
  const name = formData.get("name") as string;
  const handle = (formData.get("handle") as string).trim().replace(" ", "_").toLowerCase();
  const about = formData.get("about") as string;

  const { data: exists, error: existsError } = await supabase.rpc("check_handle_existence", { p_handle: handle });
  if (existsError || (exists && exists.length > 0)) {
    throw new Error("Username already exists");
  }

  const { error } = await supabase.from("user").insert({
    email,
    name,
    cover: "/bgcover.jpg",
    handle,
    about,
    image,
    followers: [],
    following: [AppConfig.officialaccount],
    bookmarks: [],
    liked: [],
    private: false,
  });

  if (error) throw new Error(error.message);

  const { data: officialData } = await supabase.from("user").select("*").eq("handle", AppConfig.officialaccount);

  if (officialData && officialData.length > 0) {
    const followers = officialData[0].followers || [];
    followers.push(handle);

    await supabase.from("user").update({ followers }).eq("handle", AppConfig.officialaccount);
  }

  redirect("/");
}
