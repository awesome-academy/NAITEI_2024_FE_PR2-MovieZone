import React, { useState } from "react";
import { DropdownProps } from "../movie.type";
import angleDown from "../assets/icon/angle-down.svg";

const Dropdown: React.FC<DropdownProps> = ({ label, items, isMobile = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openDropdown = () => setIsOpen(true);
  const closeDropdown = () => setIsOpen(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <>
      {isMobile ? 
        (
          <div className="w-full">
            <button
              onClick={toggleMenu}
              className="hover:text-primary transition w-5/6 mx-auto text-left flex justify-between"
            >
              {label}
              <img src={angleDown} alt="Angle Down" />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 transform origin-top ${
                isMenuOpen ? "max-h-screen opacity-100 scale-y-100" : "max-h-0 opacity-0 scale-y-0"
              }`}
            >
              {items.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  className="pl-8 block px-4 py-2 hover:bg-primary"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative">
            <button
              className="hover:text-primary transition flex"
              onMouseEnter={openDropdown}
              onMouseLeave={closeDropdown}
            >
              {label}
              <img src={angleDown} alt="Angle Down" />
            </button>
  
            <div
              className={`absolute top-5 left-0 mt-1 w-44 shadow-lg rounded-md bg-white text-dark transition-all duration-200 transform origin-top ${
                isOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
              }`}
              onMouseEnter={openDropdown}
              onMouseLeave={closeDropdown}
            >
              {items.map((item, index, arr) => (
                <a
                  key={index}
                  href={item.link || "#"}
                  onClick={item.onClick}
                  className={`block px-4 py-2 hover:bg-primary hover:text-white ${
                    index === 0 ? "rounded-t-md" : ""
                  } ${index === arr.length - 1 ? "rounded-b-md" : ""}`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

export default Dropdown;
