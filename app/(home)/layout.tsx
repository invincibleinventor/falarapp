import Search from "@/components/SearchComponent";
import { AppConfig } from "@/config/config";
import { createClient} from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import Tabbed from "./tabbed";
import Landing from "@/components/landing";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: {user}
  } = await supabase.auth.getUser();
  if (!user) return (<Landing></Landing>);
  //@ts-ignore
  const { data: profile } = supabase
    .from("profiles")
  return (
    <div className="overflow-hidden flex-1 p-0 py-2 h-screen">
      <div className="p-4 py-2 pb-2 mx-1 md:mx-1">
        <Search page="posts" text={AppConfig.title} />
      </div>
     <Tabbed/>
      {children}
    </div>
  );
}
