import Trending from "./Trending";
import WhoToFollow from "./whotofollow";


export default function Sidebar() {
  return (
    <div className="mb-auto mt-4 xl:ml-1 lg:block hidden lg:w-[500px] xl:w-[600px]">
      <div className={`flex flex-col items-start p-0 w-full md:pr-0`}>
        <WhoToFollow />
        <div className="w-full flex flex-col space-y-1  pt-[14px] mt-4 md:space-y-[0px] md:mx-4 md:pt-[4px]">
          <div className="px-5 py-0 mx-10 rounded-lg">
          <h1 className="mt-5 mb-5 text-base font-medium font-pops text-neutral-300">Trending Tags</h1>

            <Trending />
          </div>
        </div>
      </div>
    </div>
  );
}
