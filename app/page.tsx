import DeployButton from '../components/DeployButton'
import AuthButton from '../components/AuthButton'
import { createClient } from '@/utils/supabase/server'
import ConnectSupabaseSteps from '@/components/ConnectSupabaseSteps'
import SignUpUserSteps from '@/components/SignUpUserSteps'
import Header from '@/components/Header'
import { cookies } from 'next/headers'
import { useState } from 'react'

export default async function Index( {  msg,
}: {
  msg: { message: string }
}) {
  let urgent;let very;let moderate;
  const cookieStore = cookies()
  let a;
function ask(param:String){
  if(param=='Very Urgent'){
    a='bg-red-500'
  }
  else if(param=='Urgent'){
   a='bg-orange-400'
  }
  else{
    a='bg-neutral-500'
  }
  return 'inline-block px-2 py-1 text-white rounded-md '+a
  
}
  const canInitSupabaseClient = () => {
    // This function is just for the interactive tutorial.
    // Feel free to remove it once you have Supabase connected.
    try {
      createClient(cookieStore)
      return true
    } catch (e) {
      return false
    }
  }
  const supabase = createClient(cookieStore)

  const isSupabaseConnected = canInitSupabaseClient()
if(isSupabaseConnected){

  const {data,error} = await supabase.from('issues').select('*').order('id', { ascending: false })
  let posts;data?posts=data:posts=[]
  if(posts){
  moderate = posts.reduce(function(moderate, obj){
    if(obj.priority === 'Moderate'){
        moderate.push(obj.id);
    }
    return moderate;
}, []);
urgent = posts.reduce(function(urgent, obj){
  if(obj.priority === 'Urgent'){
      urgent.push(obj.id);
  }
  return urgent;
}, []);
very = posts.reduce(function(very, obj){
  if(obj.priority === 'Very Urgent'){
      very.push(obj.id);
  }
  return very;
}, []);

  }
  return (
    <div className="flex flex-col items-center flex-1 w-full gap-20">
      <nav className="flex justify-center w-full h-16 border-b border-b-foreground/10">
        <div className="flex items-center justify-between w-full max-w-4xl p-3 text-sm">
          <DeployButton />
          {isSupabaseConnected && <AuthButton />}
        </div>
      </nav>
      {posts?.length ? (
          posts.map((post:any) => (<div key={post.id}>
            <div className="w-[calc(80vw)] p-4 rounded-md bg-neutral-100">

<div className="flex flex-row items-center content-center justify-between mb-4">

  <h1 className="font-bold">{post.name}</h1>

  <div className={ask(post.priority)}>

    {post.priority}

  </div>

</div>

<div className="text-justify">

  <p>Location: {post.area}</p>

  <p>Contact Number: {post.contact}</p>

</div>

<div className="mt-4">

  <span

    className="w-full rounded-md bg-neutral-100 border-neutral-200"

  

  >{post.concern}</span>

</div>

</div></div>))
        ) : (
          <div>
            <h1>No Posts</h1>
          </div>
        )}
      {msg?.message && (
          <p className="p-4 mt-4 text-center bg-foreground/10 text-foreground">
            {msg.message}
          </p>
        )}
<div className="animate-in">
  {isSupabaseConnected ?  <div>{}</div>:<div>An Internal Server Error Occured</div>} 
</div>
      </div>
  )
}}