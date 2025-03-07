import React, { useState } from 'react';
import { LinePlotProps } from '@diamondlightsource/davidia';

// import './FormComponent.css';
import { Comparison } from '../App';
import handleSubmit from './handleSubmit';
import DataPathSelector from './pathSelector';

interface MeasurementInputProps {
  comparison: Comparison;
  setComparison: React.Dispatch<React.SetStateAction<Comparison>>;
  setPolPairPlots: React.Dispatch<React.SetStateAction<LinePlotProps[]>>;
}

export interface MeasurementForm {
  rangeStart: number | null;
  rangeEnd: number | null;
  filePath: string;
  fileSpec: string;
  selectedNumbers: number[];
}

const initialMeasurementForm = {rangeStart: null, rangeEnd: null, filePath: '', fileSpec: '', selectedNumbers: []}


function MeasurementInputs( { setPolPairPlots, comparison, setComparison }: MeasurementInputProps ) {
  const [formData, setFormData] = useState<MeasurementForm>(initialMeasurementForm);

  return (
    <form className="form-container" onSubmit={(e) => handleSubmit(e, formData, setPolPairPlots, comparison, setComparison)}>
      <h2>Experiment Data</h2>
      <DataPathSelector {...{ formData, setFormData }} />
      <button type="submit" className="submit-button">Submit</button>
    </form>
  );
};

export default MeasurementInputs;