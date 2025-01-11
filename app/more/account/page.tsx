import ColorSwitcher from "@/components/themepicker";
import Toggle from "./components/deactivatetoggle";
import Logout from "./components/logout";
import { AppConfig } from "@/config/config";

export default async function page() {
  return (
    <div>
      <div className="flex flex-col space-y-10 items-start content-center w-full px-4 md:mr-[calc(46.5*4px)]  h-[calc(100vh-104px)]">
        <div className="flex flex-col space-y-2">
          <h1 className="text-xl font-semibold text-neutral-300">{"Logout Your Account"}</h1>
          <h1 className="pb-3 text-sm font-normal text-neutral-400">
            {`You will be logged out from ${AppConfig.title}. You can log back in anytime.`}
          </h1>
          <Logout></Logout>
        </div>
        <div className="flex flex-col space-y-2">
          <h1 className="text-xl font-semibold text-neutral-300">{"Delete Account"}</h1>
          <h1 className="pb-3 text-sm font-normal text-neutral-400">
            {`Your account will be deleted. This includes deletion of all contents you generated including posts, quickies, comments, bookmarks and more. Note that this action is irreversible and that there is no way of getting back your account once it is deleted. Proceed at your own risk.`}
          </h1>
          <Toggle></Toggle>
        </div>
      </div>
    </div>
  );
}
