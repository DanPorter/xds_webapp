import React, { useState } from 'react';
import './PeriodicTable.css'; // Import the CSS file for styling
import {elements, Element} from './elements';


const PeriodicTable: React.FC = () => {
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);

  const handleSelect = (element: Element) => {
    setSelectedElement(element);
  };

  return (
    <div>
      <h1>Periodic Table</h1>
      <div className="periodic-table">
        {elements.map(element => (
          <button
            key={element.atomicNumber}
            className={`element group-${element.group} period-${element.period}`}
            onClick={() => handleSelect(element)}
          >
            {element.symbol}
          </button>
        ))}
      </div>
      {selectedElement && (
        <div>
          <h2>Selected Element</h2>
          <p>Name: {selectedElement.name}</p>
          <p>Symbol: {selectedElement.symbol}</p>
          <p>Atomic Number: {selectedElement.atomicNumber}</p>
        </div>
      )}
    </div>
  );
};

export default PeriodicTable;