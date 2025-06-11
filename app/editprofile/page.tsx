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
    <div className="flex flex-col justify-center items-center mx-auto w-screen h-screen">
          <div   className="flex overflow-hidden relative flex-col gap-2 justify-center mx-5 my-auto w-full max-w-lg">
           {/* <div className="absolute right-[20%] -top-[20%] w-[400px] h-[400px] rounded-full bg-gradient-to-br  shadow-neutral-700 from-neutral-800 to-neutral-600 shadow-xl"></div>

           <div className="absolute left-[50%] bottom-[30%] w-96 h-96 rounded-full bg-gradient-to-br from-neutral-900 to-neutral-800  shadow-xl"></div>
           <div className="absolute left-[25%] bottom-[0%] w-96 h-96 rounded-full bg-gradient-to-b from-neutral-600 to-neutral-400  shadow-xl"></div>
           <div className="absolute left-[5%] -bottom-[10%] w-96 h-96 rounded-full bg-gradient-to-l from-neutral-600 to-neutral-900  shadow-xl"></div>
      
      
      <div className="absolute right-[40%] top-[5%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-neutral-800 to-neutral-700 shadow-xl"></div>
      */}
      <form
        className="flex flex-col gap-2 justify-center px-10 py-16  my-auto w-full max-w-lg rounded-3xl filter border-[0.1px] shadow-xl  border-neutral-800 bg-black/10 animate-in text-foreground"
        action={createUser}
      >
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="image" value={image} />

        <h1 className="text-2xl font-semibold text-white">Welcome To {AppConfig.title}</h1>
        <h1 className="pb-10 text-base font-normal text-white">
          Let us setup your profile on {AppConfig.title}. Setup your profile to continue.
        </h1>

        <label className="text-sm text-neutral-300" htmlFor="name">
          Name
        </label>
        <input
          className="px-4 py-2 mb-6 text-sm rounded-xl outline-none bg-black/20 text-neutral-300 focus:outline-primary-800"
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
          className="px-4 py-2 mb-6 text-sm rounded-xl outline-none bg-black/20 text-neutral-300 focus:outline-primary-800"
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
          className="px-4 py-2 mb-6 text-sm rounded-xl outline-none bg-black/20 text-neutral-300 focus:outline-primary-800"
          name="about"
          placeholder="Please Type About Yourself"
          required
          minLength={4}
          maxLength={100}
        />

        <button className="px-8 py-4 mx-auto mb-2 w-max text-sm font-medium text-white rounded-full shadow-xl bg-primary-700">
          Setup Your Account
        </button>
      </form>
      </div>
    </div>
  );
}
