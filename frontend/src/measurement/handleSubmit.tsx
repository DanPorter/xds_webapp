// import { LinePlotProps } from '@diamondlightsource/davidia';
// import { FormData, FormErrors } from './formParameters';
// import { validate } from './validateForm';

import { decode } from 'messagepack';
// import { ExampleData } from '../DavidiaPlots';


interface MeasurementData {
  message: string;
}

const handleSubmit = async (
  e: React.FormEvent,
  formData: FormData,
  // setErrors: React.Dispatch<React.SetStateAction<FormErrors>>
) => {
  e.preventDefault();
  console.log('Submit', formData);
  // if (!validate(formData, setErrors)) return;

  try {
    const response = await fetch('http://localhost:8123/api/measurement', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    // const data = await response.json() as Data; // 404 kB
    const buffer = await response.arrayBuffer(); // 187 kB - ~half size of using unseralized JSON
    const data = await decode(new Uint8Array(buffer)) as MeasurementData;
    console.log('Response:', data.message);
    // tableSet(data.table);
    // if ('lineData' in data.plot1) {
    //   plotSet1(data.plot1);
    //   plotSet2(data.plot2);
    // } else {
    //   plotSet1(ExampleData());
    //   plotSet2(ExampleData());
    // }
  } catch (error) {
    console.error('Error:', error);
  }
};

export default handleSubmit;