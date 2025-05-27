/* eslint-disable tailwindcss/classnames-order */
"use client";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  async function login() {
    const { error } = await supabase.auth.signInWithPassword({ email: email, password: password });
    if (error) {
      console.log(error);
      alert(error.message);
    } else {
      window.location.replace("/editprofile");
    }
  }
  async function register() {
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: { data: { avatar_url: "/user.jpg" } },
    });
    if (error) {
      console.log(error);
      alert(error.message);
    } else {
      window.location.replace("/editprofile");
    }
  }

  const supabase = createClient();
  useEffect(() => {
    async function check() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const {data,error} = await supabase.from('user').select('*').eq('id',user.id);
        if(data && !error){
          return window.location.replace('/')
        }else{
          
          return window.location.replace("/editprofile");
      }
    }
    }

    check();
  }, []);
  const signWithGoogle = async () => {
    const origin = window.location.origin;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      console.log(error);
    }
    if (data.url) {
      return redirect(data.url);
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
                <h1 className="pt-2 mx-auto mt-20 text-2xl font-semibold text-left font-pops w-3xl text-neutral-300">Welcome To Falar </h1>
                <h1 className="pt-2 mx-auto mb-16 text-sm font-normal text-center font-pops max-w-96 text-neutral-400">Login to your account or create a new account to continue</h1>


      <div className="flex flex-col my-auto items-center content-center mx-auto min-w-[250px] max-w-[300px]">
        
        <form className="flex flex-col gap-2 content-center p-2 my-auto w-full text-xs font-pops">
          
          <h1 className="mt-3 pl-[1px] text-sm font-medium text-white">Email Address</h1>
          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="email"
            className="px-5 py-3 mt-1 w-full text-sm bg-black rounded-full border outline-none text-neutral-300 border-neutral-900 focus:outline-primary-800 placeholder:text-neutral-400"
            placeholder="Your Email Address"
          ></input>
          <h1 className="pl-[1px] mt-4 text-sm font-medium text-white">Password</h1>
          <input
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            className="px-5 py-3 mt-1 w-full text-sm bg-black rounded-full border outline-none text-neutral-300 border-neutral-900 focus:outline-primary-800 placeholder:text-neutral-400"
            placeholder="Your Password"
          ></input>
          <button
            onClick={(e) => (e.preventDefault(), console.log("login"), login())}
            className="px-5 py-3 mt-4 mb-2 text-sm font-medium text-white rounded-full bg-primary-800"
          >
            Sign In To Your Account
          </button>
          <button
            onClick={(e) => (e.preventDefault(), console.log("register"), register())}
            className="px-5 py-3 text-sm font-medium bg-black rounded-full border text-neutral-300 border-neutral-900"
          >
            Register Your Account
          </button>
          <button
            className="flex gap-4 justify-center px-5 py-3 mt-6 text-sm font-medium bg-black rounded-full border text-neutral-300 border-neutral-900"
            onClick={() => (console.log("google"), signWithGoogle())}
          >
            <svg width="16" height="16" viewBox="0 0 775 794" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M775 405.797C775 373.248 772.362 349.496 766.653 324.865H395.408V471.773H613.32C608.929 508.282 585.204 563.264 532.482 600.209L531.743 605.127L649.124 696.166L657.256 696.979C731.943 627.921 775 526.315 775 405.797"
                fill="#4285F4"
              />
              <path
                d="M395.408 792.866C502.167 792.866 591.792 757.676 657.256 696.979L532.482 600.209C499.093 623.521 454.279 639.796 395.408 639.796C290.845 639.796 202.099 570.741 170.463 475.294L165.826 475.688L43.772 570.256L42.1759 574.698C107.198 704.013 240.758 792.866 395.408 792.866Z"
                fill="#34A853"
              />
              <path
                d="M170.463 475.294C162.116 450.662 157.285 424.269 157.285 397C157.285 369.728 162.116 343.338 170.024 318.706L169.803 313.46L46.2193 217.373L42.1759 219.299C15.3772 272.961 0 333.222 0 397C0 460.778 15.3772 521.036 42.1759 574.698L170.463 475.294"
                fill="#FBBC05"
              />
              <path
                d="M395.408 154.201C469.656 154.201 519.74 186.31 548.298 213.143L659.891 104.059C591.356 40.2812 502.167 1.13428 395.408 1.13428C240.758 1.13428 107.198 89.9835 42.1759 219.299L170.024 318.706C202.099 223.259 290.845 154.201 395.408 154.201"
                fill="#EB4335"
              />
            </svg>
            <div>Sign in with Google</div>
          </button>
        </form>
      </div>
    </div>
  );
}
