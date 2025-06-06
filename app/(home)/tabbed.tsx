'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Tabs(){
    const pathname = usePathname();
return(<div className="flex flex-row flex-grow px-4 w-auto text-base font-medium text-white font-pops">
<Link href="/" className={`w-1/2 py-2 m-2 rounded-lg text-center ${pathname == "/" ? "bg-neutral-700/30" : ""}`}>
  Following
</Link>
<Link
  href="/all"
  className={`w-1/2 py-2 text-center rounded-lg m-2 ${pathname == "/all" ? "bg-neutral-700/30" : ""}`}
>
  Explore
</Link>
</div>
)
}