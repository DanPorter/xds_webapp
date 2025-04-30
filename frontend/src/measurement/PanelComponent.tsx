// Panel component in App.tsx

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
          <h3>Measurements</h3>
          {props.plots.map((plot, i) => (
            <DvDPlots key={i} lineProps={plot} />
          ))}
          <h3>Average</h3>
          <DvDPlots lineProps={props.comparison.experiment} table="# Average\nHere is some text." />
        </div>
    </div>
  )
};