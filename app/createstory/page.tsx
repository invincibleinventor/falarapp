import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: user } = await supabase.auth.getUser();
  let stories = [];
  if (user.user) {
    const { data, error } = await supabase.from("stories").select("*").eq("by", user.user.id);

    if (data) {
      stories = data;
    } else {
      if (error) console.log(error);
    }
  }
  return (
    <div className="">
      <div className={`h-screen flex-1 gap-2 overflow-hidden px-8`}>
        <div className="h-full overflow-y-scroll hiddenscroll">
          <form className="flex flex-col justify-center w-full gap-2 py-10 pr-5 my-auto overflow-x-hidden animate-in text-foreground">
            <button className="px-8 py-4 mb-2 text-xs font-medium text-white rounded-md bg-primary-800 w-max">
              Publish This Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
