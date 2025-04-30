

import { join } from 'path-browserify';
import { decode } from 'messagepack';
import { LinePlotProps } from '@diamondlightsource/davidia';

import { scanfiles, pol_pairs } from '../api';
import { MeasurementProps, MeasurementInputForm } from '../App';

export interface ScanFiles {
  first_number: number;
  last_number: number;
  file_spec: string;
}

/**
 * Fetches scan files from the specified visit path.
 *
 * @param {Object} params - The parameters for fetching scan files.
 * @param {string} params.visitPath - The path of the visit to fetch scan files from.
 * @returns {Promise<ScanFiles>} A promise that resolves to the scan files data.
 * @throws Will throw an error if the fetch operation fails.
 */
const fetchScanFiles = async ( visitPath: string ): Promise<ScanFiles> => {
  try {
    console.log('Fetching scan files from ', visitPath)
    const response = await fetch(scanfiles, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({'path': visitPath}),
    });
    const result = await response.json() as ScanFiles;
    return result;
  } catch (error) {
    console.error('Error fetching instrument config data:', error);
    throw error;
  }
};

/**
 * Generates a list of file paths based on the selected numbers and file specifications.
 *
 * @param {Object} params - The parameters for generating file paths.
 * @param {number[]} params.selectedNumbers - The selected numbers for generating file paths.
 * @param {string} params.filePath - The base file path.
 * @param {string} params.fileSpec - The file specification with a placeholder for the number.
 * @returns {string[]} An array of generated file paths.
 * @throws Will throw an error if the file path or specification is invalid.
 */
function generateFileList( { selectedNumbers, filePath, fileSpec }: MeasurementInputForm ): string[] {
  const files: string[] = [];
  for (let i = 0; i < selectedNumbers.length; i++) {
    files.push(
      join( 
        filePath.trim(),
        fileSpec.replace('{number}', selectedNumbers[i].toString())
      )
    );
  }
  return files;
}


/**
 * Fetches polarization pairs from the server and updates the plots and comparison data.
 *
 * @param {Object} params - The parameters for fetching polarization pairs.
 * @param {React.FormEvent} e - The form event.
 * @param {Object} params.inputForm - The input form data.
 * @param {Function} params.setPlots - The function to update the plots state.
 * @param {Object} params.comparison - The comparison data.
 * @param {Function} params.setComparison - The function to update the comparison state.
 * @throws Will throw an error if the fetch operation fails.
 */
const fetchPolPairs = async (
  e: React.FormEvent,
  {inputForm, setPlots, comparison, setComparison}: MeasurementProps,
) => {
  e.preventDefault();
  console.log('Submiting Measurement', inputForm);
  // if (!validate(formData, setErrors)) return;

  try {
    const files = generateFileList(inputForm);
    console.log('Files:', files);

    const response = await fetch(pol_pairs, {
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


export { fetchScanFiles, fetchPolPairs };