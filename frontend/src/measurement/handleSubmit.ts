
import { join } from 'path-browserify';
import { decode } from 'messagepack';
import { api } from '../api';
import { LinePlotProps } from '@diamondlightsource/davidia';

import { Comparison } from '../App';
import { MeasurementForm } from './FormComponent';


function generateFileList( formData: MeasurementForm ): string[] {
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
  formData: MeasurementForm,
  setPolPairPlots: React.Dispatch<React.SetStateAction<LinePlotProps[]>>,
  comparison: Comparison,
  setComparison: React.Dispatch<React.SetStateAction<Comparison>>,
  // setErrors: React.Dispatch<React.SetStateAction<FormErrors>>
) => {
  e.preventDefault();
  console.log('Submiting Measurement', formData);
  // if (!validate(formData, setErrors)) return;

  try {
    const files = generateFileList(formData);
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
    setPolPairPlots(data);
    const averageData = data[data.length-1] // last item in data is the average 
    setComparison({...comparison, xasLines: {
      ...comparison.xasLines,
      experimentPol1: averageData.lineData[0],  
      experimentPol2: averageData.lineData[1],
    }, diffLines: {
      ...comparison.diffLines,
      experiment: averageData.lineData[2],
    }})
  } catch (error) {
    console.error('Error:', error);
  }
};

export default handleSubmit;