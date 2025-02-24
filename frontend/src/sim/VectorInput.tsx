import React from 'react';
import './FormComponent.css';

interface VectorInputProps {
  name: string;
  label: string;
  description: string;
  value: [number, number, number];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const VectorInput: React.FC<VectorInputProps> = ({ name, label, value, description, onChange, error }) => (
  <div className="form-group">
    <label title={description}>{label}:</label>
    <div  className="vector-inputs">
    <input
        type="number"
        name={name}
        data-index="0"
        value={value[0]}
        onChange={onChange}
        title={`${label} X component`}
    />
    <input
        type="number"
        name={name}
        data-index="1"
        value={value[1]}
        onChange={onChange}
        title={`${label} Y component`}
    />
    <input
        type="number"
        name={name}
        data-index="2"
        value={value[2]}
        onChange={onChange}
        title={`${label} Z component`}
    />
    </div>
    {error && <span className="error">{error}</span>}
  </div>
);

export default VectorInput;