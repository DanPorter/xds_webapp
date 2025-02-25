import React, { useState } from 'react';
import { LinePlotProps } from '@diamondlightsource/davidia';

import './FormComponent.css';
import { defaults, FormErrors, FormData } from './formParameters';
import SymmetrySelector from './symmetry_selector';
import TextInput from './TextInput';
import NumericInput from './NumericInput';
import VectorInput from './VectorInput';
import { handleSubmit } from './handleSubmit';


interface plotSetter {
  plotSet1: React.Dispatch<React.SetStateAction<LinePlotProps>>;
  plotSet2: React.Dispatch<React.SetStateAction<LinePlotProps>>;
  tableSet: React.Dispatch<React.SetStateAction<string>>;
}


function SimulationInputs( { plotSet1, plotSet2, tableSet } : plotSetter ) {
  const [formData, setFormData] = useState<FormData>(defaults);

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const stringOptions = ['ion', 'symmetry', 'charge', 'path']
    setFormData({
      ...formData,
      [name]: stringOptions.includes(name) ? value : parseFloat(value),  // ternary operator
    });
  };

  return (
    <form className="form-container" onSubmit={(e) => handleSubmit(e, formData, tableSet, plotSet1, plotSet2, setErrors)}>
      <h2>Quanty Simulation</h2>
      <SymmetrySelector formChange={handleChange} errors={errors}/>
      <NumericInput name="beta" label="Beta" value={formData.beta} onChange={handleChange} error={errors.beta} />
      <NumericInput name="tenDq" label="10Dq" value={formData.tenDq} onChange={handleChange} error={errors.tenDq} />
      <VectorInput name="bField" label="Magnetic Field [T]" value={[formData.bFieldX, formData.bFieldY, formData.bFieldZ]} onChange={handleChange} error={errors.bField} />
      <VectorInput name="hField" label="Exchange Field [eV]" value={[formData.hFieldX, formData.hFieldY, formData.hFieldZ]} onChange={handleChange} error={errors.hField} />
      <NumericInput name="temperature" label="Temperature [K]" value={formData.temperature} onChange={handleChange} error={errors.temperature} />
      <TextInput name="path" label="Quanty Path" value={formData.path} onChange={handleChange} error={errors.path} />
      <button type="submit" className="submit-button">Submit</button>
    </form>
  );
};

export default SimulationInputs;