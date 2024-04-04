import Trending from "./Trending";
export default function Sidebar() {
  return (
    <div className="mb-auto mt-4 xl:ml-1 lg:block hidden lg:w-[500px] xl:w-[600px]">
      <div className={`  flex w-full flex-col items-start p-0 md:pr-0 `}>
       
        <div className="w-full flex flex-col space-y-1  pt-[14px] md:mt-[calc(17*4px)] md:space-y-[0px] md:mx-4 md:pt-[4px]">
          <div className="px-5 py-0 mx-10 rounded-lg bg-gray-900/20">
          <Trending/>
          </div>
        </div>
      </div>
    </div>
  );
}
