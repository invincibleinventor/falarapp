"use client";
import { Oval } from "react-loader-spinner";
export default function Loading() {
  return (
    <div className="flex content-center items-center w-full h-screen">
      <Oval
        height={80}
        width={80}
        color="#fff"
        wrapperStyle={{}}
        wrapperClass="mx-auto"
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#808080"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  );
}
