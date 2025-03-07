// Panel component in App.tsx

import { useState } from 'react';
import { LinePlotProps } from '@diamondlightsource/davidia';
import { DvDPlots } from '../DavidiaPlots';
import MeasurementInputs from './FormComponent';
import { Comparison } from '../App';


interface MeasurementPanelProps {
  comparison: Comparison;
  setComparison: React.Dispatch<React.SetStateAction<Comparison>>;
}

export default
function MeasurementPanel({ comparison, setComparison }: MeasurementPanelProps) {

  const [polPairPlots, setPolPairPlots] = useState<LinePlotProps[]>([]);

  return (
    <div className='my-window-grid'>
        <div className='my-left-panel'>
          <MeasurementInputs {...{setPolPairPlots, comparison, setComparison}} />
        </div>
        <div className='my-right-panel'>
          {polPairPlots.map((plot, i) => (
            <DvDPlots key={i} {...plot} />
          ))}
        </div>
    </div>
  )
};