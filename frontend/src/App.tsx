
import { useState } from 'react';
import { LineData } from '@diamondlightsource/davidia';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './app.css';

import MeasurementPanel from './measurement/PanelComponent';
import ComparisonPanel from './comparison/PanelComponent';
import SimulationPanel from './sim/PanelComponent';
import OpenNotebook from './jupyterRunner';

interface XasLines {
  simulationPol1?: LineData;
  simulationPol2?: LineData;
  experimentPol1?: LineData;
  experimentPol2?: LineData;
}

interface DiffLines {
  simulation?: LineData;
  experiment?: LineData;
}

export interface Comparison {
  xasLines?: XasLines;
  diffLines?: DiffLines;
  table?: string;
}

function App() {
  const [comparison, setComparison] = useState<Comparison>({})
  return (
    <Tabs>
      <TabList>
        <Tab>Experiment</Tab>
        <Tab>Simulation</Tab>
        <Tab>Compare</Tab>
        <Tab>Notebook</Tab>
      </TabList>

      <TabPanel>
        <MeasurementPanel {...{ comparison, setComparison }} /> 
      </TabPanel>

      <TabPanel>
        < SimulationPanel {...{ comparison, setComparison }} />
      </TabPanel>

      <TabPanel>
        <ComparisonPanel {...comparison} />
      </TabPanel>

      <TabPanel>
        <OpenNotebook />
      </TabPanel>
    </Tabs>
  )
}

export default App
