import React from 'react';
import './NumberRangeSelector.css';

interface NumberRangeSelectorProps {
  rangeStart: number | null;
  setRangeStart: React.Dispatch<React.SetStateAction<number | null>>;
  rangeEnd: number | null;
  setRangeEnd: React.Dispatch<React.SetStateAction<number | null>>;
  selectedNumbers: number[];
  setSelectedNumbers: React.Dispatch<React.SetStateAction<number[]>>
}

const NumberRangeSelector: React.FC<NumberRangeSelectorProps> = ({ rangeStart, setRangeStart, rangeEnd, setRangeEnd, selectedNumbers, setSelectedNumbers }) => {

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

  return (
    <div className="number-range-selector">
      <div className="number-inputs">
        <input
          type="number"
          placeholder="Start"
          value={rangeStart ?? ''}
          onChange={(e) => setRangeStart(Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="End"
          value={rangeEnd ?? ''}
          onChange={(e) => setRangeEnd(Number(e.target.value))}
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
    </div>
  );
};

export default NumberRangeSelector;