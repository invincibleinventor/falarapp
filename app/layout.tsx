import NavBar from "@/components/NavBar";
import Script from "next/script";
import "./globals.css";
import { AppConfig } from "@/config/config";
import Sidebar from "@/components/SideBar";
import { ThemeProvider } from "@/lib/themecontext";
import { cookies } from "next/headers";
const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";
import { createClient } from "@/utils/supabase/server";
export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: AppConfig.title + " - " + AppConfig.subtitle,
  description: AppConfig.description,
};
async function getuser() {
  const cookieStore = cookies();

  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if(user){
  return true;
  }
  
  else{ return false};
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {


  const loggedin = await getuser();

  return (
    <ThemeProvider>

    <html lang="en" className="noSelect font-sohne">
      <head>
        <Script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></Script>
      </head>

      <body className={AppConfig.customtheme?AppConfig.custombg:" bg-gradient-to-b to-black from-primary-950"} lang="en">
        {loggedin && 
        <main>
          <section className="relative m-auto flex h-screen font-pops flex-row content-center items-center overflow-hidden sm:w-screen lg:w-[1070px] xl:w-[1200px]">
            <NavBar></NavBar>
            <div className="w-full">
              <div className="flex-1 content-center items-center px-0 w-full h-screen border-l md:mx-0 border-l-neutral-800 md:border-x md:border-x-neutral-800">
                {children}
              </div>
            </div>

            <Sidebar></Sidebar>
          </section>
        </main>
        }
       {!loggedin && (
  <main className="">
    {children}
  </main>
)}
      </body>
    </html>
    </ThemeProvider>
  );
}