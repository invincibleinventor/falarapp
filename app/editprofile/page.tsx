'use client'
import { createClient } from "@/utils/supabase/client"
import { redirect } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
export default function Create(){
    const supabase = createClient()
   
    useEffect(()=>{
      async function get(){
        const {data:{user},error} = await supabase.auth.getUser()
        if(error){
          redirect('/login')
        }
        else{
          const {data,error} = await supabase.from('user').select('*').eq('id',user.id)
          if(data && data.length>0){
            
            window.location.replace('/')
          }else{
           
            
          setEmail(user.email)
          setImage(user.user_metadata.avatar_url)
          }
        }
      }
      get()
    })
   
    
    const [handle,setHandle] = useState('')
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [about,setAbout] = useState('')
    const [image,setImage] = useState('')
    
    const [content,setContent] = useState('')
   async function create(){
    const {data,error} = await supabase.from('user').select('*').eq('handle',handle)
    if(data.length>0){
      alert('Handle Already Exists')
    }
    else{
      const {data,error} = await supabase.from('user').insert({email:email,name:name,handle:handle,about:about,image:image,followers:[],following:[],bookmarks:[],liked:[],private:false})
    if(error){
      console.log(error)
    }
    else{
      window.location.replace('/')
    }
    }
   }
    return(
        
     <div className={`flex flex-col items-center max-w-lg px-10 mx-auto justify-center w-full h-screen `}>
  
       
     <form
       className="flex flex-col justify-center w-full gap-2 my-auto ml-auto pr-10 animate-in text-foreground"
       action={create}>
       
       <label className="text-md" htmlFor="name">
         Name
       </label>
       <textarea
        onChange={(e:any)=>setName(e.target.value)}
         className="px-4 py-2 mb-6 mr-4 border rounded-md bg-inherit"
         name="name"
         placeholder="Please Type Out Your Display Name"
         required
         minLength={4}
         maxLength={20}
       />
       <label className="text-md" htmlFor="name">
         Handle
       </label>
       <textarea
        onChange={(e:any)=>setHandle(e.target.value)}
         className="px-4 py-2 mb-6 border mr-4 rounded-md bg-inherit"
         name="handke"
         placeholder="Please Type Out Your Handle"
         required
         minLength={4}
         maxLength={20}
       />
         <label className="text-md" htmlFor="content">
         About
       </label>
       <textarea
        onChange={(e:any)=>setAbout(e.target.value)}
         className="px-4 py-2 mb-6 border mr-4 rounded-md bg-inherit"
         name="content"
         placeholder="Please Type About Yourself"
         required
         minLength={24}
         maxLength={100}
       />
      
       <button className="px-8 py-4 mb-2 text-white bg-red-400 rounded-full w-max text-foreground">
         Setup Your Account
       </button>
       
      
     </form>
   </div>
    )
}
