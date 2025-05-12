
import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './app.css';

import MeasurementPanel from './measurement/PanelComponent';
import ComparisonPanel from './comparison/PanelComponent';
import SimulationPanel from './sim/PanelComponent';
import OpenNotebook from './jupyterRunner';

import { config } from "./api";
import { LinePlotProps } from '@diamondlightsource/davidia';

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
  available_dq_values: {
    // element
    [key: string]: {
      // charge
      [key: string]: {
        // symmetry
        [key: string]: {
          initial: {
            // dq values
            [key: string]: number;
          }
          final: {
            // dq values
            [key: string]: number;
          };
        }
      }
    };
  };
};

export interface MeasurementInputForm {
  selectedInstrument: string;
  selectedVisit: string;
  instruments: string[];
  visits: string[];
  rangeStart: number | null;
  rangeEnd: number | null;
  filePath: string;
  fileSpec: string;
  selectedNumbers: number[];
  background_type: string;
}

export interface SimulationInputForm {
  ion: string;
  charge: string;
  charges: string[];
  symmetry: string;
  symmetries: string[];
  beta: number;
  tenDq: {
    [key: string]: number;
  };
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
  table: string;
  setTable: React.Dispatch<React.SetStateAction<string>>;
  comparison: ComparisonProps;
  setComparison: React.Dispatch<React.SetStateAction<ComparisonProps>>;
  simulationInput: SimulationInputForm;
  setSimulationInput: React.Dispatch<React.SetStateAction<SimulationInputForm>>;
}

export interface SimulationProps {
  config: BeamlineConfig;
  inputForm: SimulationInputForm;
  setInputForm: React.Dispatch<React.SetStateAction<SimulationInputForm>>;
  plots: LinePlotProps[];
  setPlots: React.Dispatch<React.SetStateAction<LinePlotProps[]>>;
  table: string;
  setTable: React.Dispatch<React.SetStateAction<string>>;
  comparison: ComparisonProps;
  setComparison: React.Dispatch<React.SetStateAction<ComparisonProps>>;
}


function App() {
  // defaults
  const configData: BeamlineConfig = {
    beamline: '', 
    visits: {}, 
    quanty_path: '',
    available_dq_values: {},
  };
  const measurementForm: MeasurementInputForm = {
    selectedInstrument: '',
    selectedVisit: '',
    instruments: [],
    visits: [],
    rangeStart: null,
    rangeEnd: null,
    filePath: '',
    fileSpec: '',
    selectedNumbers: [],
    background_type: 'exp',
  };
  const simulationForm: SimulationInputForm = {
    ion: '',
    charge: '',
    charges: [],
    symmetry: '',
    symmetries: [],
    beta: 0.8,
    tenDq: {'10Dq': 0.0},
    bFieldX: 0.0,
    bFieldY: 0.0,
    bFieldZ: 1.0,
    hFieldX: 0.0,
    hFieldY: 0.0,
    hFieldZ: 0.0,
    temperature: 1.0,
    path: '',
  };
  const comparisonData: ComparisonProps = {
    experiment: { plotConfig: {}, lineData: [] } as LinePlotProps,
    simulation: { plotConfig: {}, lineData: [] } as LinePlotProps
  };
  // states
  const [backendData, setBackendData] = useState<BeamlineConfig>(configData);
  const [measurementInput, setMeasurementInput] = useState<MeasurementInputForm>(measurementForm);
  const [measurementPlots, setMeasurementPlots] = useState<LinePlotProps[]>([]);
  const [measurementTable, setMeasurementTable] = useState<string>('');
  const [simulationInput, setSimulationInput] = useState<SimulationInputForm>(simulationForm);
  const [simulationPlots, setSimulationPlots] = useState<LinePlotProps[]>([]);
  const [simulationTable, setSimulationTable] = useState<string>('');
  const [comparison, setComparison] = useState<ComparisonProps>(comparisonData);
  
  // load beamline config
  useEffect(() => {
    console.log('fetching config from ', config)
    const fetchData = async () => {
      try {
        const response = await fetch(config);
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

  // props
  const measurementProps: MeasurementProps = {
    config: backendData,
    inputForm: measurementInput,
    setInputForm: setMeasurementInput,
    plots: measurementPlots,
    setPlots: setMeasurementPlots,
    table: measurementTable,
    setTable: setMeasurementTable,
    comparison: comparison,
    setComparison: setComparison,
    simulationInput: simulationInput,
    setSimulationInput: setSimulationInput,
  }
  const simulationProps: SimulationProps = {
    config: backendData,
    inputForm: simulationInput,
    setInputForm: setSimulationInput,
    plots: simulationPlots,
    setPlots: setSimulationPlots,
    table: simulationTable,
    setTable: setSimulationTable,
    comparison: comparison,
    setComparison: setComparison
  }

  return (
    <div className="container">
      <div className="banner">PolSpeX</div>
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
    </div>
  )
}

export default App
