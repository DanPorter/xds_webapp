import { LinePlotProps } from '@diamondlightsource/davidia';
import { FormData, FormErrors } from './formParameters';
import { validate } from './validateForm';

import { decode } from 'messagepack';
// import { decode } from '@msgpack/msgpack';


interface Data {
  message: string;
  table: string;
  plot1: LinePlotProps;
  plot2: LinePlotProps;
}

export const handleSubmit = async (
  e: React.FormEvent,
  formData: FormData,
  tableSet: React.Dispatch<React.SetStateAction<string>>,
  plotSet1: React.Dispatch<React.SetStateAction<LinePlotProps>>,
  plotSet2: React.Dispatch<React.SetStateAction<LinePlotProps>>,
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>
) => {
  e.preventDefault();
  console.log('Submit', formData);
  if (!validate(formData, setErrors)) return;

  try {
    const response = await fetch('http://localhost:8123/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    // const data = await response.json() as Data;
    const buffer = await response.arrayBuffer();
    const data = await decode(new Uint8Array(buffer)) as Data;
    console.log('Response:', data);
    tableSet(data.table);
    plotSet1(data.plot1);
    plotSet2(data.plot2);
  } catch (error) {
    console.error('Error:', error);
  }
};
