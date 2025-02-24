import React from 'react';

interface IonSelectProps {
  value: string;
  description: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
}

const IonSelect: React.FC<IonSelectProps> = ({ value, description, onChange, error }) => (
  <div className="form-group">
    <label title={description}>Ion:</label>
    <select name="ion" title={description} value={value} onChange={onChange}>
      <option value="" title="Select an element">--Select an element--</option>
      <option value="Ti" title="Titanium (Ti) - Atomic number 22">Titanium (Ti)</option>
      <option value="V" title="Vanadium (V) - Atomic number 23">Vanadium (V)</option>
      <option value="Cr" title="Chromium (Cr) - Atomic number 24">Chromium (Cr)</option>
      <option value="Mn" title="Manganese (Mn) - Atomic number 25">Manganese (Mn)</option>
      <option value="Fe" title="Iron (Fe) - Atomic number 26">Iron (Fe)</option>
      <option value="Co" title="Cobalt (Co) - Atomic number 27">Cobalt (Co)</option>
      <option value="Ni" title="Nickel (Ni) - Atomic number 28">Nickel (Ni)</option>
      <option value="Cu" title="Copper (Cu) - Atomic number 29">Copper (Cu)</option>
    </select>
    {error && <span className="error">{error}</span>}
  </div>
);

export default IonSelect;