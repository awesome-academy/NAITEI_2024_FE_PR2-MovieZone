import React, { useCallback, useEffect, useRef, useState } from "react";
import { RatingFilterProps } from "../movie.type";

const RatingFilter: React.FC<RatingFilterProps> = ({ voteAverageRange, onVoteChange }) => {
  const [minVal, setMinVal] = useState(voteAverageRange[0]);
  const [maxVal, setMaxVal] = useState(voteAverageRange[1]);
  const minValRef = useRef(minVal);
  const maxValRef = useRef(maxVal);
  const range = useRef<HTMLDivElement | null>(null);

  const min = 0;
  const max = 10;

  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  useEffect(() => {
    setMinVal(voteAverageRange[0]);
    setMaxVal(voteAverageRange[1]);
  }, [voteAverageRange]);

  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, maxVal, getPercent]);

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-[280px]">
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={(e) => {
            const value = Math.min(Number(e.target.value), maxVal - 1);
            setMinVal(value);
            minValRef.current = value;
            onVoteChange(e, 0);
          }}
          className={`thumb pointer-events-none absolute h-0 outline-none w-[280px] mt-10 ${minVal >= maxVal - 1 ? 'z-[5]' : 'z-[3]'}`}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={(e) => {
            const value = Math.max(Number(e.target.value), minVal + 1);
            setMaxVal(value);
            maxValRef.current = value;
            onVoteChange(e, 1);
          }}
          className="thumb pointer-events-none absolute h-0 outline-none w-[280px] mt-10 z-[4]"
        />

        <div className="absolute text-xs font-bold mt-3 left-[-4px] text-white">{minVal}</div>
        <div className="absolute text-xs font-bold mt-3 right-[-5px] text-white">{maxVal}</div>
        <div className="absolute w-full rounded h-1 mt-10 bg-gray-300 z-[1]" />
        <div ref={range} className="absolute rounded h-1 mt-10 bg-primary z-[2]" />
      </div>
    </div>
  );
};

export default RatingFilter;
