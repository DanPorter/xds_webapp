import React from 'react';
import { tooltips } from './formParameters';

interface NumericInputProps {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const TextInput: React.FC<NumericInputProps> = ({ name, label, value, onChange, error }) => (
  <div className="form-group">
    <label title={tooltips[name]}>{label}:</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      title={tooltips[name]}
    />
    {error && <span className="error">{error}</span>}
  </div>
);

export default TextInput;