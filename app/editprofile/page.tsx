import { AppConfig } from "@/config/config";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createUser } from "./actions";

export default async function CreatePage() {
  const supabase = createClient(cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data } = await supabase.from("user").select("*").eq("id", user.id);
  if (data && data.length > 0) redirect("/");

  const email = user.email!;
  const image = user.user_metadata.avatar_url;

  return (
    <div className="flex flex-col justify-center items-center px-10 mx-auto w-full max-w-lg h-screen">
      <form
        className="flex flex-col gap-2 justify-center my-auto ml-auto w-full animate-in text-foreground"
        action={createUser}
      >
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="image" value={image} />

        <h1 className="text-2xl font-semibold text-white">Welcome To {AppConfig.title}</h1>
        <h1 className="pb-10 text-base font-normal text-neutral-400">
          Let us setup your profile on {AppConfig.title}. Setup your profile to continue.
        </h1>

        <label className="text-sm text-neutral-300" htmlFor="name">
          Name
        </label>
        <input
          className="px-4 py-2 mb-6 text-sm rounded-md border outline-none bg-black/20 text-neutral-300 border-neutral-900 focus:outline-primary-800"
          name="name"
          placeholder="Please Type Out Your Name"
          required
          minLength={4}
          maxLength={20}
        />

        <label className="text-sm text-neutral-300" htmlFor="handle">
          Username - You cannot change this later
        </label>
        <input
          className="px-4 py-2 mb-6 text-sm rounded-md border outline-none bg-black/20 text-neutral-300 border-neutral-900 focus:outline-primary-800"
          name="handle"
          placeholder="Please Type Out Your Username"
          required
          minLength={4}
          maxLength={12}
        />

        <label className="text-sm text-neutral-300" htmlFor="about">
          About
        </label>
        <textarea
          className="px-4 py-2 mb-6 text-sm rounded-md border outline-none bg-black/20 text-neutral-300 border-neutral-900 focus:outline-primary-800"
          name="about"
          placeholder="Please Type About Yourself"
          required
          minLength={4}
          maxLength={100}
        />

        <button className="px-8 py-4 mx-auto mb-2 w-max text-sm font-medium text-white rounded-full bg-primary-700">
          Setup Your Account
        </button>
      </form>
    </div>
  );
}
