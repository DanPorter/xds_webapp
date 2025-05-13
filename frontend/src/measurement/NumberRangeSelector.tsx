import React, { useEffect } from 'react';

import { MeasurementProps } from '../App';
import { fetchFileMetadata } from './getData';

const NumberRangeSelector: React.FC<MeasurementProps> = ( measurementProps ) => {
  const {inputForm, setInputForm} = measurementProps
  const { rangeStart, rangeEnd, selectedNumbers, fileMetadata } = inputForm

  const handleRemove = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, number: number) => {
    event.preventDefault(); // Prevent default form submission
    setInputForm({
      ...inputForm,
      selectedNumbers: inputForm.selectedNumbers.filter((n) => n !== number)
    })
  };

  const removeAll = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault;
    setInputForm({ ...inputForm, selectedNumbers: [] });
  };

  const handleRangeStart = (event: React.ChangeEvent<HTMLInputElement> ) => {
    const value = Number(event.target.value)
    setInputForm({
      ...inputForm,
      rangeStart: value
    })
  }

  const handleRangeEnd = (event: React.ChangeEvent<HTMLInputElement> ) => {
    const value = Number(event.target.value)
    setInputForm({
      ...inputForm,
      rangeEnd: value
    })
  }

  const handleRangeSelect = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault;
    if (rangeStart !== null && rangeEnd !== null) {
      const range = Array.from({ length: rangeEnd - rangeStart + 1 }, (_, i) => rangeStart + i);
      if ( selectedNumbers.length + range.length  < 20 ) {
        setInputForm({
          ...inputForm,
          selectedNumbers: [...new Set([...selectedNumbers, ...range])],  // remove duplicates
        });
      }  
    }
  };

  useEffect(() => {
    // update Tooltips for metadata
    fetchFileMetadata(measurementProps)
  }, [selectedNumbers]);

  return (
    <div className="number-range-selector">
      <div className="number-inputs">
        <input
          type="number"
          placeholder="Start"
          value={rangeStart ?? ''}
          onChange={handleRangeStart}
        />
        <input
          type="number"
          placeholder="End"
          value={rangeEnd ?? ''}
          onChange={handleRangeEnd}
        />
        <button type="button" onClick={(e) => handleRangeSelect(e)}>Select Range</button>
        <button type="button" onClick={(e) => removeAll(e)}>Remove All</button>
      </div>
      <div className="selected-numbers">
        {selectedNumbers.map((number) => (
          <button
            key={number}
            type="button"
            title={fileMetadata[number]}
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
