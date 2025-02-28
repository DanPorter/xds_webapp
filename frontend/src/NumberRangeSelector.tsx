import React, { useState } from 'react';
import './NumberRangeSelector.css';

interface NumberRangeSelectorProps {
  min: number;
  max: number;
  onSelect: (selectedNumbers: number[]) => void;
}

const NumberRangeSelector: React.FC<NumberRangeSelectorProps> = ({ min, max, onSelect }) => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [rangeStart, setRangeStart] = useState<number | null>(min);
  const [rangeEnd, setRangeEnd] = useState<number | null>(max);

//   const handleSelect = (number: number) => {
//     if (!selectedNumbers.includes(number)) {
//       setSelectedNumbers([...selectedNumbers, number]);
//     }
//   };

  const handleRemove = (number: number) => {
    setSelectedNumbers(selectedNumbers.filter((n) => n !== number));
  };

  const removeAll = () => {
    setSelectedNumbers([]);
  };

  const handleRangeSelect = () => {
    if (rangeStart !== null && rangeEnd !== null) {
      const range = Array.from({ length: rangeEnd - rangeStart + 1 }, (_, i) => rangeStart + i);
      setSelectedNumbers([...selectedNumbers, ...range]);
      setRangeStart(null);
      setRangeEnd(null);
    }
  };

  const handleSubmit = () => {
    onSelect(selectedNumbers);
  };

  return (
    <div className="number-range-selector">
      <div className="number-inputs">
        <input
          type="number"
          placeholder="Start"
          value={rangeStart ?? ''}
          onChange={(e) => setRangeStart(Number(e.target.value))}
          min={min}
          max={max}
        />
        <input
          type="number"
          placeholder="End"
          value={rangeEnd ?? ''}
          onChange={(e) => setRangeEnd(Number(e.target.value))}
          min={min}
          max={max}
        />
        <button onClick={handleRangeSelect}>Select Range</button>
        <button onClick={removeAll}>Remove All</button>
      </div>
      <div className="selected-numbers">
        {selectedNumbers.map((number) => (
          <button
            key={number}
            className="selected-number-button"
            onClick={() => handleRemove(number)}
          >
            {number} &times;
          </button>
        ))}
      </div>
      <button onClick={handleSubmit} className="submit-button">Submit</button>
    </div>
  );
};

export default NumberRangeSelector;