import React from 'react';
import { useEffect } from 'react';

import { ScanFiles, fetchScanFiles } from './getData';
import NumberRangeSelector from './NumberRangeSelector';
import { MeasurementProps } from '../App';


const DataPathSelector: React.FC<MeasurementProps> = ( props ) => {
  console.log('DataPathSelector props: ', props)
  const { inputForm, setInputForm } = props;
  const config = props.config;
  const selectedInstrument = inputForm.selectedInstrument;
  const setSelectedInstrument = (instrument: string) => setInputForm({...inputForm, selectedInstrument: instrument});
  const selectedVisit = inputForm.selectedVisit;
  const setSelectedVisit = (visit: string) => setInputForm({...inputForm, selectedVisit: visit});
  const instruments = inputForm.instruments;
  const setInstruments = (instruments: string[]) => setInputForm({...inputForm, instruments: instruments});
  const visits = inputForm.visits;
  const setVisits = (visits: string[]) => setInputForm({...inputForm, visits: visits});
  const visitPath = inputForm.filePath
  const setVisitPath = (path: string) => setInputForm({...inputForm, filePath: path})

  // load local beamline file parameters
  if (Object.keys(config.visits).length > 0) {
    console.log('beamlines: ', Object.keys(config.visits))
    setInstruments(Object.keys(config.visits));
  }
  if (config.beamline && config.beamline in config.visits) {
    console.log('setting beamline to ', config.beamline);
    setSelectedInstrument(config.beamline);
    setVisits(Object.keys(config.visits[config.beamline]));
    setSelectedVisit(Object.keys(config.visits[config.beamline])[0]);
    setVisitPath(config.visits[config.beamline][Object.keys(config.visits[config.beamline])[0]]);
  }

  // load files from visit path on visitPath change
  useEffect(() => {
    const fetchData = async () => {
      if (!visitPath) return;
      console.log('fetching scan files from ', visitPath)
      const result: ScanFiles = await fetchScanFiles(visitPath);
      console.log('result: ', result)
      if (result.first_number) {
        setInputForm({
          ...inputForm, 
          fileSpec: result.file_spec,
          rangeStart: result.first_number,
          rangeEnd: result.last_number
        });
      }
    };
    fetchData()
      .catch(console.error);;
  }, [visitPath]);

  // client side directory selector

  const handleDirectorySelect = async () => {
    try {
      const directoryHandle = await window.showDirectoryPicker();
      const fileNames = [];
      console.log('directoryHandle: ', directoryHandle);
      setVisitPath(directoryHandle.name);
      for await (const entry of directoryHandle.values()) {
        if (entry.kind === 'file' && entry.name.endsWith('.nxs')) {
          fileNames.push(await entry.getFile());
        }
      }
      console.log('filenames found:', fileNames)
      extractNumbers(fileNames);
    } catch (error) {
      console.error('Error selecting directory:', error);
    }
  };

  // client side file selector

  const handleFileSelect = async () => {
    const pickerOpts = {
      types: [{
        description: "Nexus Files",
        accept: {
          "nxs/*": [".nxs"],
        },
      }],
      excludeAcceptAllOption: true,
      multiple: true,
    } as OpenFilePickerOptions;
    try {
      const fileHandles = await window.showOpenFilePicker(pickerOpts);
      const fileNames = [];
      console.log('fileHandles: ', fileHandles);
      for await (const entry of fileHandles.values()) {
        if (entry.kind === 'file' && entry.name.endsWith('.nxs')) {
            const file = await entry.getFile();
            fileNames.push(file);
            console.log('Full file path: ', entry.name);  // not the full file path!
        }
      }
      extractNumbers(fileNames, true);
    } catch (error) {
      console.error('Error selecting files:', error);
    }
  };

  const extractNumbers = (files: File[], select: boolean = false) => {
    const numberPattern = /\d{3,}/g;
    const extractedNumbers = files.flatMap(file => {
      const matches = file.name.match(numberPattern);
      return matches && ! isNaN(Number(matches)) ? Number(matches) : [];
    });
    console.log('Extracted numbers from files: ', extractedNumbers)
    setInputForm({
      ...inputForm, 
      fileSpec: files[0].name.replace(numberPattern, '{number}'),
      rangeStart: Math.min(...extractedNumbers),
      rangeEnd: Math.max(...extractedNumbers),
      selectedNumbers: select ? extractedNumbers : []
    });
  };


  // dropdown onChange handlers

  const handleInstrumentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const instrument = event.target.value;
    setSelectedInstrument(instrument);
    const visits = config.visits;
    if (visits && instrument in visits) {
      setVisits(Object.keys(visits[instrument]));
      setSelectedVisit('');
    }
  };

  const handleVisitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const visit = event.target.value;
    const visits = config.visits;
    setSelectedVisit(visit);
    if (visits) {
      setVisitPath(visits[selectedInstrument][visit]);
    }
  };

  const handlePathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVisitPath(event.target.value);
  };

  return (
    <>
      { instruments.length > 0 &&  // only display if on /dls file system
        <div className="form-group">
          <label title='Select Instrument'>Instrument:</label>
          <select name="ion" title='Select Instrument' value={selectedInstrument} onChange={handleInstrumentChange}>
            <option value="">Select Instrument</option>
            {instruments.map((instrument) => (
              <option key={instrument} value={instrument}>
                {instrument}
              </option>
            ))}
          </select>
          {/* {errors.ion && <span className="error">{errors.ion}</span>} */}
        </div>
      }
      { instruments.length > 0 &&
        <div className="form-group">
          <label title='Select Visit'>Visit:</label>
          <select name="visit" title='Select Visit' value={selectedVisit} onChange={handleVisitChange} disabled={!selectedInstrument}>
            <option value="">Select VisitID</option>
            {visits.map((visit) => (
              <option key={visit} value={visit}>
                {visit}
              </option>
            ))}
          </select>
          {/* {errors.charge && <span className="error">{errors.charge}</span>} */}
        </div>
      }
      <div className="form-group">
        <label title='Path'>Path:</label>
        <span>
          <input
            type="text"
            name="path"
            value={visitPath}
            onChange={handlePathChange}
            title='file path of data files'
          />
          <button onClick={handleDirectorySelect}>Select Directory</button>
          <button onClick={handleFileSelect}>Select Files</button>
          {/* <input type="file" id="fileElem" multiple /> */}
        </span>
        
        <span>
          <label title='File Spec'>File Spec:</label>
          <input
            type="text"
            name="fileSpec"
            value={inputForm.fileSpec}
            title='file name pattern with {number} as placeholder'
            onChange={(e) => setInputForm({...inputForm, fileSpec: e.target.value})}
          />
        </span>
        {/* {error && <span className="error">{error}</span>} */}
        { inputForm.fileSpec && <p>Path Spec: {inputForm.fileSpec}</p>}
        <NumberRangeSelector {... props } />
        {inputForm.selectedNumbers.length > 0 && <p>Selected Numbers: {inputForm.selectedNumbers.join(', ')}</p>}
      </div>
    </>
  );
};

export default DataPathSelector;