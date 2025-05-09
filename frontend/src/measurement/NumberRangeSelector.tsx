import React from 'react';

import { MeasurementProps } from '../App';

const NumberRangeSelector: React.FC<MeasurementProps> = ( props ) => {
  const { inputForm, setInputForm } = props;
  const rangeStart = inputForm.rangeStart;
  const rangeEnd = inputForm.rangeEnd;
  const selectedNumbers = inputForm.selectedNumbers;
  const setRangeStart = (start: number) => {
    setInputForm({ ...inputForm, rangeStart: start });
  }
  const setRangeEnd = (end: number) => {
    setInputForm({ ...inputForm, rangeEnd: end });
  }
  const setSelectedNumbers = (numbers: number[]) => {
    setInputForm({ ...inputForm, selectedNumbers: numbers });
  }

  // const handleRemove = (number: number) => {
  //   setSelectedNumbers(inputForm.selectedNumbers.filter((n) => n !== number));
  //   // setInputForm({ ...inputForm, formData.selectedNumbers.filter((n) => n !== number));
  // };
  const handleRemove = (event: React.FormEvent, number: number) => {
    event.preventDefault(); // Prevent default form submission
    setSelectedNumbers(inputForm.selectedNumbers.filter((n) => n !== number));
  };

  const removeAll = () => {
    // setInputForm({ ...inputForm, selectedNumbers: [] });
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
        <button type="submit" onClick={handleRangeSelect}>Select Range</button>
        <button type="submit" onClick={removeAll}>Remove All</button>
      </div>
      <div className="selected-numbers">
        {selectedNumbers.map((number) => (
          <button
            key={number}
            type="submit"
            className="selected-number-button"
            onClick={(e) => handleRemove(e, number)}
          >
            {number} &times;
          </button>
        ))}
      </div>
    </div>
  );
};

export default NumberRangeSelector;
