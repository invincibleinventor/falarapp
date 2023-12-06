import Link from 'next/link'
import { headers, cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
export default function Login({
  searchParams,
}: {
  searchParams: { message: string }
}) {

   

  const signWithGoogle = async (formData: FormData) => {
    'use server'

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const origin = headers().get('origin')
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',options:{
          redirectTo: `${origin}/auth/callback`,
        }
    })


    if (error) {
        return redirect('/login?message=Could not authenticate user')
    }

    return redirect(data.url);
}



  return (
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
        className="flex flex-col justify-center flex-1 w-full gap-2 animate-in text-foreground"
        action={signWithGoogle}
      >
        
        <button className="px-4 py-2 mb-2 text-white bg-green-700 rounded-md text-foreground">
          Sign In With Google
        </button>
       
        {searchParams?.message && (
          <p className="p-4 mt-4 text-center bg-foreground/10 text-foreground">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  )
}
