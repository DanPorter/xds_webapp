// Panel component in App.tsx

import { useState } from 'react';
import { LinePlotProps } from '@diamondlightsource/davidia';
import { DvDPlots } from '../DavidiaPlots';
import MarkdownPreview from '../MarkdownTextBox';
import { Comparison } from '../App';
import { ExampleData } from '../DavidiaPlots';
import SimulationInputs from './FormComponent';


interface SimulationPanelProps {
  comparison: Comparison;
  setComparison: React.Dispatch<React.SetStateAction<Comparison>>;
}

export default
function SimulationPanel({ comparison, setComparison }: SimulationPanelProps) {
  const exampleData = ExampleData()
  const [simPlot1, setSimPlot1] = useState<LinePlotProps>(exampleData) 
  const [simPlot2, setSimPlot2] = useState<LinePlotProps>(exampleData) 
  const [simTable, setSimTable] = useState('');

  return (
    <div className='my-window-grid'>
      <div className='my-left-panel'>
        <SimulationInputs 
          plotSet1={setSimPlot1} 
          plotSet2={setSimPlot2} 
          tableSet={setSimTable} 
          comparison={comparison}
          setComparison={setComparison}
        />
      </div>
      <div className='my-right-panel'>
        <DvDPlots {...simPlot1} />
        <DvDPlots {...simPlot2} />
        <MarkdownPreview markdown={simTable} />
      </div>
    </div>
  )
};