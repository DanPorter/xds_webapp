
import { useState } from 'react';
import { LinePlotProps } from '@diamondlightsource/davidia';
import MarkdownPreview from './MarkdownTextBox';

import { DvDPlots, ExampleData } from './DavidiaPlots';
import SimulationInputs from './sim/FormComponent';



function App() {
  const [plot1, setPlot1] = useState<LinePlotProps>(ExampleData()) 
  const [plot2, setPlot2] = useState<LinePlotProps>(ExampleData()) 
  const [table, setTable] = useState('')

  return (
    <div className='my-window-grid'>
      <div className='my-left-panel'>
        <SimulationInputs plotSet1={setPlot1} plotSet2={setPlot2} tableSet={setTable}/>
      </div>
      <div className='my-right-panel'>
        {/* <DvDPlots xdata={xdata} ydata={ydata} xlabel='Energy [eV]' ylabel='Intensity' /> */}
        <DvDPlots {...plot1} />
        <DvDPlots {...plot2} />
        {/* <div dangerouslySetInnerHTML={{ __html: table }} /> */}
        <MarkdownPreview markdown={table}/>
      </div>
    </div>
  )
}

export default App
