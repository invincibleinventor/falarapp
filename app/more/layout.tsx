import SettingsBar from "@/components/SettingsBar";
import "../globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <section className="flex overflow-hidden relative flex-col pt-4 h-screen md:mt-0">
      <SettingsBar />

       <div className="mt-0 w-full">
          <div className="flex-1 px-4 pt-10 w-full backdrop-blur-md md:border-none md:px-20 sm:px-10 md:pt-14">{children}</div>
        </div>
      </section>
    </main>
  );
}
