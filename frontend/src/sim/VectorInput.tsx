import React from 'react';
import './FormComponent.css';
import { tooltips } from './formParameters';

interface VectorInputProps {
  name: string;
  label: string;
  value: [number, number, number];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const VectorInput: React.FC<VectorInputProps> = ({ name, label, value, onChange, error }) => (
  <div className="form-group">
    <label title={tooltips[name]}>{label}:</label>
    <div  className="vector-inputs">
    <input
        type="number"
        name={name + 'X'}
        data-index="0"
        value={value[0]}
        onChange={onChange}
        title={`${label} X direction`}
    />
    <input
        type="number"
        name={name + 'Y'}
        data-index="1"
        value={value[1]}
        onChange={onChange}
        title={`${label} Y direction`}
    />
    <input
        type="number"
        name={name + 'Z'}
        data-index="2"
        value={value[2]}
        onChange={onChange}
        title={`${label} Z direction`}
    />
    </div>
    {error && <span className="error">{error}</span>}
  </div>
);

export default VectorInput;