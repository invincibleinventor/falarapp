'use client';
import { colorPalettes, useTheme } from "@/lib/themecontext";

  
  
export default function ColorSwitcher() {
    const { currentColor, setColor } = useTheme();

  
  return (
    <div className="">
     
      <div className="grid grid-cols-4 md:grid-cols-5 gap-y-4  w-[calc(100%-20px)]">
        {Object.keys(colorPalettes).map((color) => (
          <div
            key={color}
            className={`relative border border-neutral-500 w-8 h-8 rounded-full`}
            style={{
              backgroundColor: colorPalettes[color]["700"],
            }}
            onClick={() => setColor(color)}
          >
            {currentColor === color && (
              <div className="absolute inset-0 flex items-center justify-center">
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
