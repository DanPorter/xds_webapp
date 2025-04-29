
import { join } from 'path-browserify';
import { decode } from 'messagepack';
import { api } from '../api';
import { LinePlotProps } from '@diamondlightsource/davidia';

import { MeasurementProps, MeasurementInputForm } from '../App';


function generateFileList( formData: MeasurementInputForm ): string[] {
  const files: string[] = [];
  for (let i = 0; i < formData.selectedNumbers.length; i++) {
    files.push(
      join(  
        formData.filePath.trim(),
        formData.fileSpec.replace('{number}', formData.selectedNumbers[i].toString())
      )
    );
  }
  return files;
}


const handleSubmit = async (
  e: React.FormEvent,
  {inputForm, setPlots, comparison, setComparison}: MeasurementProps,
) => {
  e.preventDefault();
  console.log('Submiting Measurement', inputForm);
  // if (!validate(formData, setErrors)) return;

  try {
    const files = generateFileList(inputForm);
    console.log('Files:', files);

    const response = await fetch(api + '/pol_pairs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({files: files}),
    });
    const buffer = await response.arrayBuffer(); 
    const data = await decode(new Uint8Array(buffer)) as LinePlotProps[]; 
    console.log('Measurement Response:', data);
    setPlots(data.slice(0, data.length-1));
    const averageData = data[data.length-1] // last item in data is the average 
    setComparison({...comparison, 'experiment': averageData})
  } catch (error) {
    console.error('Error:', error);
  }
};

export default handleSubmit;