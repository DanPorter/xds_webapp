import React, { useState } from 'react';
import './NumberSelector.css';

interface NumberSelectorProps {
  numbers: number[];
}

const NumberSelector: React.FC<NumberSelectorProps> = ({ numbers }) => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);

  const handleSelect = (number: number) => {
    if (!selectedNumbers.includes(number)) {
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };

  const handleRemove = (number: number) => {
    setSelectedNumbers(selectedNumbers.filter((n) => n !== number));
  };

  return (
    <div className="number-selector">
      <div className="number-list">
        {numbers.map((number) => (
          <button
            key={number}
            className={`number-button ${selectedNumbers.includes(number) ? 'selected' : ''}`}
            onClick={() => handleSelect(number)}
          >
            {number}
          </button>
        ))}
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

export default NumberSelector;