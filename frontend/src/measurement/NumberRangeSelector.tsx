import React from 'react';

import { MeasurementForm } from './FormComponent';

interface NumberRangeSelectorProps {
  formData: MeasurementForm;
  setFormData: React.Dispatch<React.SetStateAction<MeasurementForm>>;
}

const NumberRangeSelector: React.FC<NumberRangeSelectorProps> = ({ formData, setFormData }) => {

  const rangeStart = formData.rangeStart;
  const rangeEnd = formData.rangeEnd;
  const selectedNumbers = formData.selectedNumbers;
  const setRangeStart = (start: number) => {
    setFormData({ ...formData, rangeStart: start });
  }
  const setRangeEnd = (end: number) => {
    setFormData({ ...formData, rangeEnd: end });
  }
  const setSelectedNumbers = (numbers: number[]) => {
    setFormData({ ...formData, selectedNumbers: numbers });
  }

  const handleRemove = (number: number) => {
    setSelectedNumbers(formData.selectedNumbers.filter((n) => n !== number));
    // setFormData({ ...formData, formData.selectedNumbers.filter((n) => n !== number));
  };

  const removeAll = () => {
    // setFormData({ ...formData, selectedNumbers: [] });
    setSelectedNumbers([]);
  };

  const handleRangeSelect = () => {
    if (rangeStart !== null && rangeEnd !== null) {
      const range = Array.from({ length: rangeEnd - rangeStart + 1 }, (_, i) => rangeStart + i);
      if ( selectedNumbers.length + range.length  < 20 ) {
        setSelectedNumbers([...selectedNumbers, ...range]);
      }  
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
