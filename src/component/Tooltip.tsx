import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { TooltipProps } from "../movie.type";

const Tooltip: React.FC<TooltipProps> = ({ text, children, width='w-auto', translateX='translate-x-0'}) => {
  const [visible, setVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  const showTooltip = () => {
      setVisible(true);
  };

  const hideTooltip = () => {
    setVisible(false);
  };

  useEffect(() => {
    const handleMouseLeave = () => hideTooltip();
    const targetElement = targetRef.current;

    if (targetElement) {
      targetElement.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (targetElement) {
        targetElement.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  useEffect(() => {
    if (targetRef.current && tooltipRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      setTooltipPosition({
        top: rect.bottom + window.scrollY + 10,
        left: rect.left + window.scrollX + (rect.width - tooltipRect.width) / 2,
      });

      setVisible(true);
    }
  }, [text, visible]);

  return (
    <div ref={targetRef} className="relative inline-block" onMouseEnter={showTooltip}>
      {children}
      {visible &&
        ReactDOM.createPortal(
          <div
            ref={tooltipRef}
            className={`absolute z-50 bg-white text-dark text-sm rounded p-2 shadow-md ${width} ${translateX}`}
            style={{
              top: tooltipPosition.top,
              left: tooltipPosition.left,
            }}
          >
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 border-b-8 border-b-white border-l-8 border-l-transparent  border-r-8 border-r-transparent"></div>
            {text}
          </div>,
          document.body
        )}
    </div>
  );
};

export default Tooltip;
