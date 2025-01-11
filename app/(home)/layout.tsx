import Search from "@/components/SearchComponent";
import { AppConfig } from "@/config/config";

import Link from "next/link";
import Tabbed from "./tabbed";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <div className="flex-1 h-screen p-0 py-2 overflow-hidden">
      <div className="p-4 py-2 pb-2 mx-1 md:mx-1">
        <Search page="posts" text={AppConfig.title} />
      </div>
     <Tabbed/>
      {children}
    </div>
  );
}
