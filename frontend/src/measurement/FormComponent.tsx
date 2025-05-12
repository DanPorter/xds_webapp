import React from 'react';
import { useEffect } from 'react';

import { MeasurementProps } from '../App';
import { ScanFiles, fetchScanFiles, fetchMeasurement } from './getData';
import NumberRangeSelector from './NumberRangeSelector';


function MeasurementInputs( props: MeasurementProps ) {
  const { inputForm, setInputForm, config } = props;
  const { filePath, selectedInstrument, instruments, selectedVisit, visits } = inputForm;

  // load local beamline file parameters
  if (Object.keys(config.visits).length > 0) {
    console.log('beamlines: ', Object.keys(config.visits))
    setInputForm({...inputForm, instruments: Object.keys(config.visits) });
  }
  if (config.beamline && config.beamline in config.visits) {
    console.log('setting beamline to ', config.beamline);
    setInputForm({
      ...inputForm,
      selectedInstrument: config.beamline,
      visits: Object.keys(config.visits[config.beamline]),
      selectedVisit: Object.keys(config.visits[config.beamline])[0],
      filePath: config.visits[config.beamline][Object.keys(config.visits[config.beamline])[0]],
    });
  }

  // load files from visit path on visitPath change
  useEffect(() => {
    const fetchData = async () => {
      if (!filePath) return;
      console.log('fetching scan files from ', filePath)
      const result: ScanFiles = await fetchScanFiles(filePath);
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
      .catch(console.error);
  }, [filePath]);

  // dropdown onChange handlers
  const handleInstrumentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const instrument = event.target.value;
    setInputForm({...inputForm, selectedInstrument: instrument });
    const visits = config.visits;
    if (visits && instrument in visits) {
      setInputForm({
        ...inputForm,
        visits: Object.keys(visits[instrument]),
        selectedVisit: ''
      });
    };
  };

  const handleVisitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const visit = event.target.value;
    const visits = config.visits;
    setInputForm({
      ...inputForm,
      selectedVisit: visit,
      filePath: visit ? visits[selectedInstrument][visit] : ''
    });
  };

  const handlePathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputForm({ ...inputForm, filePath: event.target.value });
  };

  const handleBackgroundChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setInputForm({ ...inputForm, background_type: value });
  }
  return (
    <form className="form-container" onSubmit={(e) => fetchMeasurement(e, props)}>
      <h2>Experiment Data</h2>
      {/* ---Instrument Selection--- */}
      { instruments.length > 0 &&  // only display if on /dls file system
        <div className="form-group">
          <label title='Select Instrument'>Instrument:</label>
          <select name="instrument" title='Select Instrument' value={selectedInstrument} onChange={handleInstrumentChange}>
            <option value="">Select Instrument</option>
            {instruments.map((instrument) => (
              <option key={instrument} value={instrument}>
                {instrument}
              </option>
            ))}
          </select>
        </div>
      }
      {/* ---Visit Selection--- */}
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
        </div>
      }
      {/* ---Data Path & FileSpec--- */}
      <div className="form-group">
        <label title='Path'>Path:</label>
        <span>
          <input
            type="text"
            name="path"
            value={filePath}
            onChange={handlePathChange}
            title='file path of data files'
          />
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
      </div>
      {/* ---NumberRangeSelectror.tsx--- */}
      <div className="form-group">
        <NumberRangeSelector {... props } />
      </div>
      {/* ---Background--- */}
      <div className="form-group">
        <label title='Select Background'>Background:</label>
        <select name="background" title='Select background subtraction' value={inputForm.background_type} onChange={handleBackgroundChange}>
          <option value="">Select Background</option>
          <option key="flat" value="flat">flat</option>
          <option key="curve" value="curve">curved</option>
          <option key="exp" value="exp">exponential</option>
        </select>
      </div>
      <button type="submit" className="submit-button">Submit</button>
    </form>
  );
};

export default MeasurementInputs;