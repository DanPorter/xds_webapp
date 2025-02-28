
import { useState } from 'react';
import { LinePlotProps } from '@diamondlightsource/davidia';
import MarkdownPreview from './MarkdownTextBox';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import { DvDPlots, ExampleData } from './DavidiaPlots';
import SimulationInputs from './sim/FormComponent';
// import NumberSelector from './NumberSelector';
// import HoverPanel from './HoverPanel';
// import NumberRangeSelector from './NumberRangeSelector';
import MeasurementInputs from './measurement/FormComponent';


function App() {
  const [plot1, setPlot1] = useState<LinePlotProps>(ExampleData()) 
  const [plot2, setPlot2] = useState<LinePlotProps>(ExampleData()) 
  const [table, setTable] = useState('');
  // const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);

  // const handleNumberSelect = (numbers: number[]) => {
  //   setSelectedNumbers(numbers);
  //   console.log('Selected numbers:', numbers);
  // };
  return (
    <Tabs>
      <TabList>
        <Tab>Other Options</Tab>
        <Tab>Simulation</Tab>
      </TabList>

      <TabPanel>
        <div>
          <MeasurementInputs />
        </div>
      </TabPanel>

      <TabPanel>
        <div className='my-window-grid'>
          <div className='my-left-panel'>
            <SimulationInputs plotSet1={setPlot1} plotSet2={setPlot2} tableSet={setTable} />
          </div>
          <div className='my-right-panel'>
            <DvDPlots {...plot1} />
            <DvDPlots {...plot2} />
            <MarkdownPreview markdown={table} />
          </div>
        </div>
      </TabPanel>
    </Tabs>
  )
}

export default App
