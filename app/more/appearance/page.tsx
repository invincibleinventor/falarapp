import ColorSwitcher from "@/components/themepicker";

import { AppConfig } from "@/config/config";

export default async function page() {
  return (
    <div>
      <div className={`hidden bg-gradient-to-b ${AppConfig.custombg}`}></div>

      <div className="flex flex-col space-y-10 items-start content-center w-full px-4 md:mr-[calc(46.5*4px)]  h-[calc(100vh-104px)]">
       
        <div className="flex flex-col space-y-2">
          <h1 className="text-xl font-semibold text-neutral-300">{"App Theme"}</h1>
          <h1 className="pb-3 text-sm font-normal text-neutral-400">
            {`This will change the appearance of ${AppConfig.title} to match with the color scheme selected.`}
          </h1>
          <ColorSwitcher/>
        </div>
      </div>
    </div>
  );
}
