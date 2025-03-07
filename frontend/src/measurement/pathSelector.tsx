import React from 'react';
import { useState, useEffect } from 'react';

import { BeamlineConfig, ScanFiles, fetchInstrumentVisits, fetchScanFiles } from './getData';
import { MeasurementForm } from './FormComponent';
import NumberRangeSelector from './NumberRangeSelector';


interface DataPathSelectorProps {
  formData: MeasurementForm;
  setFormData: React.Dispatch<React.SetStateAction<MeasurementForm>>;
}

const DataPathSelector: React.FC<DataPathSelectorProps> = ({ formData, setFormData }) => {
  const [data, setData] = useState<BeamlineConfig>({ visits: {}, beamline: '' });
  const [selectedInstrument, setSelectedInstrument] = useState<string>('');
  const [selectedVisit, setSelectedVisit] = useState<string>('');
  // const [visitPath, setVisitPath] = useState<string>('');
  const [instruments, setInstruments] = useState<string[]>([]);
  const [visits, setVisits] = useState<string[]>([]);

  const visitPath = formData.filePath
  const setVisitPath = (path: string) => setFormData({...formData, filePath: path})

  // load local atom data parameters
  useEffect(() => {
    const fetchData = async () => {
      const result: BeamlineConfig = await fetchInstrumentVisits();
      setData(result);
      if (Object.keys(result.visits).length > 0) {
        console.log('beamlines: ', Object.keys(result.visits))
        setInstruments(Object.keys(result.visits));
      }
      if (result.beamline && result.beamline in result.visits) {
        console.log('setting beamline to ', result.beamline);
        setSelectedInstrument(result.beamline);
        setVisits(Object.keys(result.visits[result.beamline]));
        setSelectedVisit(Object.keys(result.visits[result.beamline])[0]);
      }
      if (result.beamline && result.beamline in result.visits) {
        console.log('setting beamline to ', result.beamline);
        setSelectedInstrument(result.beamline);
        setVisits(Object.keys(result.visits[result.beamline]));
        setSelectedVisit(Object.keys(result.visits[result.beamline])[0]);
        setVisitPath(result.visits[result.beamline][Object.keys(result.visits[result.beamline])[0]]);
      }
    };
    fetchData()
      .catch(console.error);;
  }, []);

  // load files from visit path on visitPath change
  useEffect(() => {
    const fetchData = async () => {
      if (!visitPath) return;
      console.log('fetching scan files from ', visitPath)
      const result: ScanFiles = await fetchScanFiles(visitPath);
      console.log('result: ', result)
      if (result.first_number) {
        setFormData({
          ...formData, 
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
    setFormData({
      ...formData, 
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
    if (data.visits && instrument in data.visits) {
      setVisits(Object.keys(data.visits[instrument]));
      setSelectedVisit('');
    }
  };

  const handleVisitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const visit = event.target.value;
    setSelectedVisit(visit);
    if (data.visits) {
      setVisitPath(data.visits[selectedInstrument][visit]);
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
            value={formData.fileSpec}
            title='file name pattern with {number} as placeholder'
            onChange={(e) => setFormData({...formData, fileSpec: e.target.value})}
          />
        </span>
        {/* {error && <span className="error">{error}</span>} */}
        { formData.fileSpec && <p>Path Spec: {formData.fileSpec}</p>}
        <NumberRangeSelector formData={formData} setFormData={setFormData} />
        {formData.selectedNumbers.length > 0 && <p>Selected Numbers: {formData.selectedNumbers.join(', ')}</p>}
      </div>
    </>
  );
};

export default DataPathSelector;