import React from "react";

export default function NotFound() {
  return (
    <div className="bg-red-200 flex items-center justify-center h-screen w-full overflow-hidden">
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="lg:max-w-7xl sm:max-w-8xl"
      >
        <path
          // fill="#D0E2FF"
          fill="#fff"
          d="M35.4,-45.6C50.4,-45.5,70.1,-43.3,80.1,-33.1C90.2,-23,90.6,-4.9,85.6,10.6C80.7,26.1,70.4,39.1,58.7,48.7C47,58.3,33.9,64.6,21.5,64C9.1,63.4,-2.6,56,-14.3,51.4C-26.1,46.8,-38,45,-50.5,39C-63.1,33.1,-76.4,23,-80.7,10C-85,-2.9,-80.3,-18.7,-72.9,-32.6C-65.5,-46.5,-55.4,-58.6,-42.8,-59.8C-30.3,-60.9,-15.1,-51.2,-2.4,-47.4C10.2,-43.6,20.5,-45.7,35.4,-45.6Z"
          transform="translate(100 100)"
        />
      </svg>
      <div className="absolute text-black">
        <h1 className="lg:text-6xl md:text-4xl sm:text-base">404 Not Found</h1>
        <h2 className="lg:text-4xl md:text-2xl sm:text-sm">
          Sorry, we could not find the page you were looking for
        </h2>
      </div>
    </div>
  );
}
