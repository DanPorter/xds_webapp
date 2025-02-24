import React from 'react';

interface SymSelectProps {
  value: string;
  description: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
}

const SymmetrySelect: React.FC<SymSelectProps> = ({ value, description, onChange, error }) => (
  <div className="form-group">
    <label>Symmetry:</label>
    <select name="symmetry" title={description} value={value} onChange={onChange}>
      <option value="Oh" title="Octahedral symmetry">Oh</option>
      <option value="Td" title="Tetrahedral symmetry">Td</option>
      <option value="D4h" title="Square planar symmetry">D4h</option>
      <option value="C3v" title="Trigonal pyramidal symmetry">C3v</option>
      <option value="C2v" title="Bent or angular symmetry">C2v</option>
    </select>
    {error && <span className="error">{error}</span>}
  </div>
);

export default SymmetrySelect;