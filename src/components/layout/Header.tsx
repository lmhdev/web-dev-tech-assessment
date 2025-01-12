import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-gray-bg py-1 w-full flex justify-center">
      <div className="flex items-center gap-2 md:w-4/6">
        <img src="vite.svg" alt="Logo" className="w-4 h-4 md:w-5 md:h-5" />
        <p className="text-gray-text text-sm md:text-base">
          An Official Website of the <b>Singapore Government</b>
        </p>
      </div>
    </header>
  );
};

export default Header;
