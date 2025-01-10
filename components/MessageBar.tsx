'use client'
import { useEffect, useState } from "react";
import MessageItem from "./MessageItem";
import { redirect } from "next/navigation";

export default function MessageBar(props:any){
   
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    useEffect(() => {
        const isScreenSmall = () => window.innerWidth < 768;
        
        const handleResize = () => {
            setIsSmallScreen(isScreenSmall());
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    function handle(link:any)
    {
       if(isSmallScreen){
        props.opened(false)
         redirect(link)
    }
    else{
         redirect(link)

    }
    }
    return(
        <div className="flex flex-col flex-grow divide-y divide-neutral-800 md:flex-none">
           <MessageItem onClick={()=>handle('"/messages/dms/1212"')}  name="Sample" message="Nice message" dp="https://picsum.photos/200/400"/>
          
        </div>
    )
}