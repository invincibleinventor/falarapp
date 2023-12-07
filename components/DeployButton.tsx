import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import React from 'react'
export default async function DeployButton() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user ? (
    <div className='flex flex-row items-center content-center gap-4'>
    <Link href="/" className="mr-2 font-semibold md:text-xl">CFRH</Link>
    <Link
      className="flex px-5 py-2 no-underline border rounded-md hover:bg-btn-background-hover"
     href="/create"
    >
     
      New
    </Link></div>
  ) : (<Link href="/" className="font-semibold md:text-xl">CFRH</Link>)
}
