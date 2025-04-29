// Panel component in App.tsx

// import { useState } from 'react';
// import { LinePlotProps } from '@diamondlightsource/davidia';
import { DvDPlots } from '../DavidiaPlots';
import MeasurementInputs from './FormComponent';
import { MeasurementProps } from '../App';


export default
function MeasurementPanel(props: MeasurementProps) {

  return (
    <div className='my-window-grid'>
        <div className='my-left-panel'>
          <MeasurementInputs {...props} />
        </div>
        <div className='my-right-panel'>
          {props.plots.map((plot, i) => (
            <DvDPlots key={i} {...plot} />
          ))}
        </div>
    </div>
  )
};