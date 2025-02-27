import { LinePlotProps } from '@diamondlightsource/davidia';
import { FormData, FormErrors } from './formParameters';
import { validate } from './validateForm';

import { decode } from 'messagepack';
import { ExampleData } from '../DavidiaPlots';
// import { decode } from '@msgpack/msgpack';


interface SimulationData {
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
    // const data = await response.json() as Data; // 404 kB
    const buffer = await response.arrayBuffer(); // 187 kB - ~half size of using unseralized JSON
    const data = await decode(new Uint8Array(buffer)) as SimulationData;
    console.log('Response:', data.message);
    tableSet(data.table);
    if ('lineData' in data.plot1) {
      plotSet1(data.plot1);
      plotSet2(data.plot2);
    } else {
      plotSet1(ExampleData());
      plotSet2(ExampleData());
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
