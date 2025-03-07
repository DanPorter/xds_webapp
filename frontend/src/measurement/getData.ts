
import { api } from "../api";

export interface BeamlineConfig {
  beamline: string;
  visits: {
    // beamline
    [key: string]: {
      // visitID: path
      [key: string]: string;
    };
  };
};

/**
 * Fetches the instrument visits from the server.
 *
 * @returns {Promise<BeamlineConfig>} A promise that resolves to the instrument visits data.
 * @throws Will throw an error if the fetch operation fails.
 */
const fetchInstrumentVisits = async (): Promise<BeamlineConfig> => {
  try {
    const response = await fetch(api + '/config');
    const result = await response.json() as BeamlineConfig;
    return result;
  } catch (error) {
    console.error('Error fetching instrument config data:', error);
    throw error;
  }
};

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
    const response = await fetch(api + '/scanfiles', {
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


export { fetchInstrumentVisits, fetchScanFiles };