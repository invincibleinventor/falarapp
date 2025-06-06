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
      <div className={`overflow-hidden flex-1 gap-2 px-8 h-screen`}>
        <div className="overflow-y-scroll h-full hiddenscroll">
          <form className="flex overflow-x-hidden flex-col gap-2 justify-center py-10 pr-5 my-auto w-full animate-in text-foreground">
            <button className="px-8 py-4 mb-2 w-max text-xs font-medium text-white rounded-md bg-primary-700">
              Publish This Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
