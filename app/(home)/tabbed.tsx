'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Tabs(){
    const pathname = usePathname();
return(<div className="flex flex-row flex-grow w-auto text-base font-medium text-white font-pops">
<Link href="/" className={`w-1/2 py-4 text-center ${pathname == "/" ? "border-b-2 border-b-primary-800" : ""}`}>
  Following
</Link>
<Link
  href="/all"
  className={`w-1/2 py-4 text-center ${pathname == "/all" ? "border-b-2 border-b-primary-800" : ""}`}
>
  Explore
</Link>
</div>
)
}