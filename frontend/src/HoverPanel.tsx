import React, { useState } from 'react';
import './HoverPanel.css';

interface HoverPanelProps {
  options: string[];
  onSelect: (option: string) => void;
}

const HoverPanel: React.FC<HoverPanelProps> = ({ options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="hover-panel-container">
      <button className="hover-panel-toggle" onClick={() => setIsOpen(!isOpen)}>
        Select Option
      </button>
      {isOpen && (
        <div className="hover-panel">
          {options.map((option) => (
            <button
              key={option}
              className="hover-panel-option"
              onClick={() => handleSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HoverPanel;