import { useState, useRef, useEffect } from "react";

const useToggleVisibility = () => {
  const [isOpen, setIsOpen] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const toggle = () => setIsOpen(!isOpen);

  const handleClickOutside = (event: MouseEvent) => {
    if (elementRef.current && !elementRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return { isOpen, setIsOpen, toggle, elementRef };
};

export default useToggleVisibility
