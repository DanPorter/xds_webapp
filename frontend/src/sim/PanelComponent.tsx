// Panel component in App.tsx


import { DvDPlots } from '../DavidiaPlots';
import { SimulationProps } from '../App';
import SimulationInputs from './FormComponent';


export default
function SimulationPanel(props: SimulationProps) {
  return (
    <div className='my-window-grid'>
      <div className='my-left-panel'>
        <SimulationInputs {...props} />
      </div>
      <div className='my-right-panel'>
        {props.plots.map((plot, i) => (
          <DvDPlots key={i} lineProps={plot} />
        ))}
      </div>
    </div>
  )
};