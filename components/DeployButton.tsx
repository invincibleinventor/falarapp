import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
export default async function DeployButton() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user ? (
    <a
      className="flex px-3 py-2 no-underline border rounded-md hover:bg-btn-background-hover"
     href="/create"
    >
     
      New
    </a>
  ) : (<div className="font-semibold md:text-xl">CFHS</div>)
}
