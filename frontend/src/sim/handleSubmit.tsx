import { LinePlotProps } from '@diamondlightsource/davidia';
import { FormErrors } from './formParameters';
import { validate } from './validateForm';

import { decode } from 'messagepack';
// import { decode } from '@msgpack/msgpack';
import { simulation } from '../api';
import { SimulationProps } from '../App';


interface SimulationData {
  message: string;
  table: string;
  plot1: LinePlotProps;
  plot2: LinePlotProps;
}

export const handleSubmit = async (
  e: React.FormEvent,
  props: SimulationProps,
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>
) => {
  e.preventDefault();
  const { inputForm, setPlots, setTable, setComparison, comparison } = props;
  console.log('Simulation Submit', inputForm);
  if (!validate(inputForm, setErrors)) return;

  try {
    const response = await fetch(simulation, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputForm),
    });
    // const data = await response.json() as Data; // 404 kB
    const buffer = await response.arrayBuffer(); // 187 kB - ~half size of using unseralized JSON
    const data = await decode(new Uint8Array(buffer)) as SimulationData;
    console.log('Response:', data.message);
    if ('lineData' in data.plot1) {
      setPlots([data.plot1, data.plot2]);
      setTable(data.table);
      setComparison({
        ...comparison, 
        simulation: data.plot2, 
        table: data.table
      })
    } else {
      setPlots([]);
      setTable('');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
