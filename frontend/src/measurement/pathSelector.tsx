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
  const [instruments, setInstruments] = useState<string[]>([]);
  const [visits, setVisits] = useState<string[]>([]);

  // load local atom data parameters
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/config');
        const result = await response.json();
        setData(result);
        if (Object.keys(result.visits).length > 0) {
          setInstruments(Object.keys(result.visits || {}));
        }
        if (result.beamline && result.beamline in result.visits) {
          console.log('setting beamline to ', result.beamline);
          setSelectedInstrument(result.beamline);
          setVisits(Object.keys(result.visits[result.beamline] || {}));
          setSelectedVisit(Object.keys(result.visits[result.beamline] || {})[0]);
          setVisitPath(result.visits[result.beamline][Object.keys(result.visits[result.beamline] || {})[0]]);
        }
      } catch (error) {
        console.error('Error fetching instrument config data:', error);
      }
    };

    fetchData();
  }, []);
  console.log('local Beamline Config data: ', data);

  const handleInstrumentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const instrument = event.target.value;
    setSelectedInstrument(instrument);
    if (data.visits && instrument in data.visits) {
      setVisits(Object.keys(data.visits[instrument] || {}));
      setSelectedVisit('');
    }
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
      { instruments.length > 0 &&  // only display if on /dls file system
        <div className="form-group">
          <label title='Select Instrument'>Instrument:</label>
          <select name="ion" title='Select Instrument' value={selectedInstrument} onChange={handleInstrumentChange}>
            <option value="">Select Instrument</option>
            {Object.keys(instruments).map((instrument) => (
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
            <option value="">Select Charge</option>
            {Object.keys(visits).map((visit) => (
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