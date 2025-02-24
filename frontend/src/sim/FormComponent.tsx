import React, { useState } from 'react';
import { LinePlotProps } from '@diamondlightsource/davidia';

import './FormComponent.css';
// import IonSelect from './IonSelect';
// import SymmetrySelect from './SymmetrySelect';
import SymmetrySelector from './symmetry_selector';
import TextInput from './TextInput';
import NumericInput from './NumericInput';
import VectorInput from './VectorInput';


var tooltips: {[id: string]: string} = {
    ion: 'Atomic element',
    charge: 'ionic charge (integer)',
    symmetry: 'site symmetry',
    beta: 'Universal scaling parameter for the Slater integrals (beta)',
    tenDq: 'Crystal Field Splitting (10Dq) [eV]',
    bField: 'External magnetic field, (Bext) [Tesla]',
    hField: 'Exchange field (H) [eV]',
    temperature: 'Temperature [Kelvin]',
    path: 'Path of the Quanty Executable',
}


interface FormData {
  ion: string;
  charge: string;
  symmetry: string;
  beta: number;
  tenDq: number;
  bFieldX: number;
  bFieldY: number;
  bFieldZ: number;
  hFieldX: number;
  hFieldY: number;
  hFieldZ: number;
  temperature: number;
  path: string;
}

interface FormErrors {
  ion?: string;
  charge?: string;
  beta?: string;
  tenDq?: string;
  bField?: string;
  hField?: string;
  temperature?: string;
  path?: string;
}

// interface plotSetters {
//   xDataSetter: React.Dispatch<React.SetStateAction<never[]>>;
//   yDataSetter: React.Dispatch<React.SetStateAction<never[]>>;
// }

interface plotSetter {
  plotSet1: React.Dispatch<React.SetStateAction<LinePlotProps>>;
  plotSet2: React.Dispatch<React.SetStateAction<LinePlotProps>>;
  tableSet: React.Dispatch<React.SetStateAction<string>>;
}

// interface lineData {
//   x: number[] | NDT;
//   y: number[] | NDT;
// }


function SimulationInputs( { plotSet1, plotSet2, tableSet } : plotSetter ) {
  const [formData, setFormData] = useState<FormData>({
    ion: '',
    charge: '',
    symmetry: 'Oh',
    beta: 0.8,
    tenDq: 1.0,
    bFieldX: 0.0,
    bFieldY: 0.0,
    bFieldZ: 1.0,
    hFieldX: 0.0,
    hFieldY: 0.0,
    hFieldZ: 0.0,
    temperature: 1.0,
    path: 'C:\\Users\\grp66007\\Documents\\quanty\\quanty_win\\QuantyWin64.exe',//'Quanty',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const stringOptions = ['ion', 'symmetry', 'charge', 'path']
    setFormData({
      ...formData,
      // [name]: name === 'ion' || name === 'symmetry' || name === 'charge' || name === 'path' ? value : parseFloat(value),
      [name]: stringOptions.includes(name) ? value : parseFloat(value),  // ternary operator
    });
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.ion) newErrors.ion = 'Ion is required';
    // if (formData.charge <= 0) newErrors.charge = 'Charge must be greater than 0';
    // if (formData.beta <= 0) newErrors.beta = 'Beta must be greater than 0';
    // if (formData.tenDq <= 0) newErrors.tenDq = '10Dq must be greater than 0';
    if (formData.temperature <= 0) newErrors.temperature = 'Temperature must be greater than 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit', formData)
    if (!validate()) return;

    try {
      const response = await fetch('http://localhost:8123/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log('Response:', data);
      // xDataSetter(data['plot2']['lineData'][0]['x'])
      // yDataSetter(data['plot2']['lineData'][0]['y'])
      console.log('plot2', data['plot2'])
      // data['plot2'].lineData.forEach((line: lineData) => {
      //   line.x = ndarray(new Float32Array(line.x as number[])) as NDT;
      //   line.y = ndarray(new Float32Array(line.y as number[])) as NDT;
      // })
      // console.log('plot2 recast', data['plot2'])
      tableSet(data['table'])
      plotSet1(data['plot1'])
      plotSet2(data['plot2'])
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Input Form</h2>
      {/* <IonSelect value={formData.ion} description={tooltips.ion} onChange={handleChange} error={errors.ion} />
      <NumericInput name="charge" label="Charge" description={tooltips.charge} value={formData.charge} onChange={handleChange} error={errors.charge} />
      <SymmetrySelect value={formData.symmetry} description={tooltips.symmetry} onChange={handleChange} /> */}
      <SymmetrySelector formChange={handleChange}/>
      <NumericInput name="beta" label="Beta"  description={tooltips.beta} value={formData.beta} onChange={handleChange} error={errors.beta} />
      <NumericInput name="tenDq" label="10Dq"  description={tooltips.tenDq} value={formData.tenDq} onChange={handleChange} error={errors.tenDq} />
      <VectorInput name="bField" label="Magnetic Field [T]" description={tooltips.bField} value={[formData.bFieldX, formData.bFieldY, formData.bFieldZ]} onChange={handleChange} error={errors.bField} />
      <VectorInput name="hField" label="Exchange Field [eV]" description={tooltips.hField} value={[formData.hFieldX, formData.hFieldY, formData.hFieldZ]} onChange={handleChange} error={errors.hField} />
      <NumericInput name="temperature" label="Temperature [K]"  description={tooltips.temperature} value={formData.temperature} onChange={handleChange} error={errors.temperature} />
      <TextInput name="path" label="Quanty Path" description={tooltips.path} value={formData.path} onChange={handleChange} error={errors.path} />
      <button type="submit" className="submit-button">Submit</button>
    </form>
  );
};

export default SimulationInputs;