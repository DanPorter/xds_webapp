import React from 'react';
import { useState, useEffect } from 'react';


interface BeamlineConfig {
  beamline?: string;
  visits?: {
    // beamline
    [key: string]: {
      // visitID: path
      [key: string]: string;
    };
  };
};

interface PathSelectProps {
  formChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  // errors: FormErrors;
}

const DataPathSelector: React.FC<PathSelectProps> = ({ formChange }) => {
  const [data, setData] = useState<BeamlineConfig>({});
  const [selectedInstrument, setSelectedInstrument] = useState<string>('');
  const [selectedVisit, setSelectedVisit] = useState<string>('');
  const [visitPath, setVisitPath] = useState<string>('');

  // load local atom data parameters
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/config');
        const result = await response.json();
        setData(result);
        if (result.beamline) {
          setSelectedInstrument(result.beamline);
        }
        if (Object.keys(result.visits).length > 0) {
          const visit = result.visits[Object.keys(result.visits)[0]];
          setSelectedVisit(visit);
          setVisitPath(result.visits[visit]);
        }
      } catch (error) {
        console.error('Error fetching instrument config data:', error);
      }
    };

    fetchData();
  }, []);

  const handleInstrumentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const instrument = event.target.value;
    setSelectedInstrument(instrument);
    setSelectedVisit('');
    formChange(event);
  };

  const handleVisitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const visit = event.target.value;
    setSelectedVisit(visit);
    if (data.visits && visit in data.visits) {
      setVisitPath(data.visits[selectedInstrument][visit]);
    }
    formChange(event);
  };

  const handlePathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVisitPath(event.target.value);
    // formChange(event);
  };

  return (
    <>
      { data.visits &&
        <div className="form-group">
          <label title='Select Instrument'>Instrument:</label>
          <select name="ion" title='Select Instrument' value={selectedInstrument} onChange={handleInstrumentChange}>
            <option value="">Select Instrument</option>
            {Object.keys(data).map((instrument) => (
              <option key={instrument} value={instrument}>
                {instrument}
              </option>
            ))}
          </select>
          {/* {errors.ion && <span className="error">{errors.ion}</span>} */}
        </div>
      }
      { data.visits &&
        <div className="form-group">
          <label title='Select Visit'>Visit:</label>
          <select name="visit" title='Select Visit' value={selectedVisit} onChange={handleVisitChange} disabled={!selectedInstrument}>
            <option value="">Select Charge</option>
            {Object.keys(data.visits).map((visit) => (
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
        <input
          type="text"
          name="path"
          value={visitPath}
          onChange={handlePathChange}
          title='file path of data files'
        />
        {/* {error && <span className="error">{error}</span>} */}
      </div>
    </>
  );
};

export default DataPathSelector;