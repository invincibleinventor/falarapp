'use client';
import { colorPalettes, useTheme } from "@/lib/themecontext";

  
  
export default function ColorSwitcher() {
    const { currentColor, setColor } = useTheme();

  
  return (
    <div className="">
     
      <div className="grid grid-cols-4 gap-2  w-[calc(100%-20px)]">
        {Object.keys(colorPalettes).map((color) => (
          <div
            key={color}
            className={`relative w-full h-12 rounded-md aspect-video`}
            style={{
              backgroundColor: colorPalettes[color]["800"],
            }}
            onClick={() => setColor(color)}
          >
            {currentColor === color && (
              <div className="flex absolute inset-0 justify-center items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
     
    </div>
  );
}
