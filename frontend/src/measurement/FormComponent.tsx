import React, { useState } from 'react';
// import { LinePlotProps } from '@diamondlightsource/davidia';

import './FormComponent.css';
import handleSubmit from './handleSubmit';
import DataPathSelector from './pathSelector';





function MeasurementInputs() {
  const [formData, setFormData] = useState<FormData>({} as FormData);

  // const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <form className="form-container" onSubmit={(e) => handleSubmit(e, formData)}>
      <h2>Experiment Data</h2>
      <DataPathSelector formChange={handleChange}/>
      <button type="submit" className="submit-button">Submit</button>
    </form>
  );
};

export default MeasurementInputs;