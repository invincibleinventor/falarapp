import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'
export default async function Create({
    msg,
  }: {
    msg: { message: string }
  }) {
    
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const create = async (formData: FormData) => {
    "use server";
    
    const name = formData.get('name') as string
    const area = formData.get('area') as string
    const contact = formData.get('contact') as string
    const concern = formData.get('concern') as string
    const priority = formData.get('priority') as string
    const creates = async () => {  const cookieStore = cookies()
'use client'
        const supabase = createClient(cookieStore)

        
  const {data,error } = await supabase.from('issues').insert({name:name,area:area,contact:contact,concern:concern,priority:priority})
if(error){
return redirect('/create?message='+error.message)
}
    return redirect('/?message=Successfully Posted Your Complaint')
  }

await creates()
}
  return user ? (
   
        
    

     
     <div className="flex flex-col justify-center flex-1 w-full gap-2 px-8 sm:max-w-md">
      <Link
        href="/"
        className="absolute flex items-center px-4 py-2 text-sm no-underline rounded-md left-8 top-8 text-foreground bg-btn-background hover:bg-btn-background-hover group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{' '}
        Back
      </Link>

      <form
        className="flex flex-col justify-center flex-1 w-full gap-2 my-auto animate-in text-foreground"
        action={create}
      >
        {msg?.message && (
          <p className="p-4 mt-4 text-center bg-foreground/10 text-foreground">
            {msg.message}
          </p>
        )}
        <label className="text-md" htmlFor="name">
          Name Of Affected Person
        </label>
        <input
          className="px-4 py-2 mb-6 border rounded-md bg-inherit"
          name="name"
          placeholder="Name Of Affected Person(s)"
          required
        />
          <label className="text-md" htmlFor="area">
          Area
        </label>
        <input
          className="px-4 py-2 mb-6 border rounded-md bg-inherit"
          name="area"
          placeholder="Area (Be as precise as possible)"
          required
        />
          <label className="text-md" htmlFor="contact">
          Phone Number
        </label>
        <input
          className="px-4 py-2 mb-6 border rounded-md bg-inherit"
          name="contact"
          type="number"
          maxLength={10}
          placeholder="Phone Number"
          required
        />
        <label className="text-md" htmlFor="concern">
          Concern
        </label>
        <textarea
          className="px-4 py-2 mb-6 border rounded-md bg-inherit"
          name="concern"
          placeholder="Please Type Out Your Concern"
          required
        />
          <label className="text-md" htmlFor="concern">
          Priority Of Your Request (Please Be Honest)
        </label>
         <select className='px-4 py-2 mb-6 border rounded-md bg-inherit' name="priority">
        <option value="Very Urgent">Very Urgent</option>
        <option value="Urgent">Urgent</option>
        <option value="Moderate">Moderate</option>
      </select>
        <button className="px-4 py-2 mb-2 text-white bg-green-700 rounded-md text-foreground">
          Submit The Complaint
        </button>
        
       
      </form>
    </div>
   
  ) : (<div>Login To Create Complaints</div>)
}
