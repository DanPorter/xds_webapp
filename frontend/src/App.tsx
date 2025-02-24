
import { useState } from 'react';
import { LinePlotProps } from '@diamondlightsource/davidia';

import { DvDPlots, ExampleData } from './DavidiaPlots';
import SimulationInputs from './sim/FormComponent';



function App() {
  const [plot1, setPlot1] = useState<LinePlotProps>(ExampleData()) 
  const [plot2, setPlot2] = useState<LinePlotProps>(ExampleData()) 

  return (
    <div className='my-window-grid'>
      <div className='my-left-panel'>
        <SimulationInputs plotSet1={setPlot1} plotSet2={setPlot2}/>
      </div>
      <div className='my-right-panel'>
        {/* <DvDPlots xdata={xdata} ydata={ydata} xlabel='Energy [eV]' ylabel='Intensity' /> */}
        <DvDPlots {...plot1} />
        <DvDPlots {...plot2} />
      </div>
    </div>
  )
}

export default App
