import React from 'react';

interface NumericInputProps {
  name: string;
  label: string;
  description: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const TextInput: React.FC<NumericInputProps> = ({ name, label, description, value, onChange, error }) => (
  <div className="form-group">
    <label title={description}>{label}:</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      title={description}
    />
    {error && <span className="error">{error}</span>}
  </div>
);

export default TextInput;