
import { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './app.css';

import MeasurementPanel from './measurement/PanelComponent';
import ComparisonPanel from './comparison/PanelComponent';
import SimulationPanel from './sim/PanelComponent';
import OpenNotebook from './jupyterRunner';

import { api } from "./api";
import { LinePlotProps } from '@diamondlightsource/davidia';
import { ScanFiles } from './measurement/getData';

export interface BeamlineConfig {
  beamline: string;
  visits: {
    // beamline
    [key: string]: {
      // visitID: path
      [key: string]: string;
    };
  };
  quanty_path: string;
  available_symmetries: {
    // element
    [key: string]: {
      // charge: symmetries[]
      [key: string]: string[];
    };
  }
};

export interface MeasurementInputForm {
  selectedInstrument: string;
  selectedVisit: string;
  visitPath: string;
  instruments: string[];
  visits: string[];
  visitFiles: ScanFiles;
  rangeStart: number | null;
  rangeEnd: number | null;
  filePath: string;
  fileSpec: string;
  selectedNumbers: number[];
}

export interface SimulationInputForm {
  ion: string;
  charge: string;
  charges: string[];
  symmetry: string;
  symmetries: string[];
  beta: number;
  tenDq: number;
  bFieldX: number;
  bFieldY: number;
  bFieldZ: number;
  hFieldX: number;
  hFieldY: number;
  hFieldZ: number;
  temperature: number;
  path: string;
}

export interface ComparisonProps {
  experiment: LinePlotProps;
  simulation: LinePlotProps;
  table?: string;
}

export interface MeasurementProps {
  config: BeamlineConfig;
  inputForm: MeasurementInputForm;
  setInputForm: React.Dispatch<React.SetStateAction<MeasurementInputForm>>;
  plots: LinePlotProps[];
  setPlots: React.Dispatch<React.SetStateAction<LinePlotProps[]>>;
  comparison: ComparisonProps;
  setComparison: React.Dispatch<React.SetStateAction<ComparisonProps>>;
}

export interface SimulationProps {
  config: BeamlineConfig;
  inputForm: SimulationInputForm;
  setInputForm: React.Dispatch<React.SetStateAction<SimulationInputForm>>;
  plots: LinePlotProps[];
  setPlots: React.Dispatch<React.SetStateAction<LinePlotProps[]>>;
  comparison: ComparisonProps;
  setComparison: React.Dispatch<React.SetStateAction<ComparisonProps>>;
}


function App() {
  // defaults
  const configData = {
    beamline: '', 
    visits: {}, 
    quanty_path: '', 
    available_symmetries: {}
  } as BeamlineConfig;
  const measurementForm = {
    selectedInstrument: '',
    selectedVisit: '',
    visitPath: '',
    instruments: [],
    visits: [],
    visitFiles: { first_number: 0, last_number: 0, file_spec: '' },
    rangeStart: null,
    rangeEnd: null,
    filePath: '',
    fileSpec: '',
    selectedNumbers: []
  } as MeasurementInputForm;
  const simulationForm = {
    ion: '',
    charge: '',
    charges: [],
    symmetry: '',
    symmetries: [],
    beta: 0.8,
    tenDq: 1.0,
    bFieldX: 0.0,
    bFieldY: 0.0,
    bFieldZ: 1.0,
    hFieldX: 0.0,
    hFieldY: 0.0,
    hFieldZ: 0.0,
    temperature: 1.0,
    path: '',
  } as SimulationInputForm;
  const comparisonData = {
    experiment: { plotConfig: {}, lineData: [] } as LinePlotProps,
    simulation: { plotConfig: {}, lineData: [] } as LinePlotProps
  } as ComparisonProps;
  // states
  const [backendData, setBackendData] = useState<BeamlineConfig>(configData);
  const [measurementInput, setMeasurementInput] = useState<MeasurementInputForm>(measurementForm);
  const [measurementPlots, setMeasurementPlots] = useState<LinePlotProps[]>([]);
  const [simulationInput, setSimulationInput] = useState<SimulationInputForm>(simulationForm);
  const [simulationPlots, setSimulationPlots] = useState<LinePlotProps[]>([]);
  const [comparison, setComparison] = useState<ComparisonProps>(comparisonData);
  // load beamline config
  useEffect(() => {
    console.log('fetching config from ', api + '/config')
    const fetchData = async () => {
      try {
        const response = await fetch(api + '/config');
        const result = await response.json();
        setBackendData({...backendData, ...result});
        setSimulationInput((prev) => ({
          ...prev,
          path: result.quanty_path,
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  // load local atom data parameters
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(api + '/elements');
        const result = await response.json();
        setBackendData({...backendData, available_symmetries: result});
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  // props
  const measurementProps: MeasurementProps = {
    config: backendData,
    inputForm: measurementInput,
    setInputForm: setMeasurementInput,
    plots: measurementPlots,
    setPlots: setMeasurementPlots,
    comparison: comparison,
    setComparison: setComparison
  }
  const simulationProps: SimulationProps = {
    config: backendData,
    inputForm: simulationInput,
    setInputForm: setSimulationInput,
    plots: simulationPlots,
    setPlots: setSimulationPlots,
    comparison: comparison,
    setComparison: setComparison
  }

  return (
    <Tabs>
      <TabList>
        <Tab>Experiment</Tab>
        <Tab>Simulation</Tab>
        <Tab>Compare</Tab>
        <Tab>Notebook</Tab>
      </TabList>

      <TabPanel>
        <MeasurementPanel {... measurementProps} /> 
      </TabPanel>

      <TabPanel>
        < SimulationPanel {... simulationProps} />
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
