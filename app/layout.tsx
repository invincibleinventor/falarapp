import NavBar from "@/components/NavBar";
import Script from "next/script";
import "./globals.css";
import { AppConfig } from "@/config/config";
import Sidebar from "@/components/SideBar";
import { ThemeProvider } from "@/lib/themecontext";
const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: AppConfig.title + " - " + AppConfig.subtitle,
  description: AppConfig.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>

    <html lang="en" className="noSelect font-sohne">
      <head>
        <Script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></Script>
      </head>

      <body className="mainbg" lang="en">
        <main>
          <section className="relative m-auto flex h-screen flex-row content-center items-center overflow-hidden sm:w-screen lg:w-[1070px] xl:w-[1200px]">
            <NavBar></NavBar>
            <div className="w-full ">
              <div className="items-center content-center flex-1 w-full h-screen px-0 border-l md:mx-0 border-l-neutral-900 md:border-x md:border-x-neutral-900">
                {children}
              </div>
            </div>

            <Sidebar></Sidebar>
          </section>
        </main>
      </body>
    </html>
    </ThemeProvider>
  );
}