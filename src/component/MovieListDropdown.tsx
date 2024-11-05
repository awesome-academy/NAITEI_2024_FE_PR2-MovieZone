import React, { useState, useRef, useEffect } from "react";
import { ReactComponent as AngleDown } from "../assets/icon/angle-downV.svg";
import { MovieListDropdownProps } from "../movie.type";

const MovieListDropdown = <T,>({
  label,
  selectedValue = null,
  options,
  onChange,
}: MovieListDropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (value: T | null) => {
    onChange(value);
    setIsOpen(false);
  };

  const selectedLabel = options.find(option => option.value === selectedValue)?.label;

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-end mt-3" ref={dropdownRef}>
      <span className="mr-2 text-sm">{label}:</span>
      <div className="inline-block relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white border-2 text-dark text-sm rounded-md flex p-1 hover:border-primary"
        >
          {selectedLabel}
          <span className="transform transition-transform">
            <AngleDown className="w-5 h-5 ml-2" />
          </span>
        </button>
        <div
          className={`absolute right-0 w-full z-10 bg-white rounded-md shadow-lg text-sm origin-top transition-transform transform duration-200
          ${isOpen ? "scale-y-100" : "scale-y-0 max-h-0"}`}
        >
          {options.map((option, index) => (
            <div
              key={option.value as string}
              onClick={() => handleOptionClick(option.value)}
              className={`cursor-pointer p-1 hover:bg-primary hover:text-white
                ${selectedValue === option.value ? 'bg-primary text-white' : 'text-dark'}
                ${index === 0 ? 'rounded-t-md' : ''}
                ${index === options.length - 1 ? 'rounded-b-md' : ''}`}
            >
              {option.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieListDropdown;
