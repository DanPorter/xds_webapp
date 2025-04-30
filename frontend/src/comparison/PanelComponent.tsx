import { useState, useEffect } from 'react';
import MarkdownPreview from '../MarkdownTextBox';
import { DvDPlots } from '../DavidiaPlots';
import { LinePlotProps } from '@diamondlightsource/davidia';
import { ComparisonProps } from '../App';
import ndarray from 'ndarray';
import ops from 'ndarray-ops';

export default function ComparisonPanel(comparison: ComparisonProps) {
  console.log('ComparisonPanel:', comparison);

  // determine approximate scale of the y-axis
  const expSum = Math.abs(ops.sum(ndarray(new Float32Array(comparison.experiment.lineData[2].y.data))));
  const simSum = Math.abs(ops.sum(ndarray(new Float32Array(comparison.simulation.lineData[0].y.data))));
  const scale = expSum / simSum; // Calculate the scale factor based on the sum of y-values
  console.log('expSum', expSum, 'simSum', simSum, 'scale:', scale);
  // const scale = 1.0; // Default scale factor

  // useRef (multipoint in Davidia)
  const [xOffset, setXOffset] = useState(0.0); // State to manage the x-axis offset
  const [yScale, setYScale] = useState(scale); // State to manage the y-axis scale
  const [invertY, setInvertY] = useState(false); // State to manage y-axis inversion
  const [adjustedSimulation, setAdjustedSimulation] = useState(comparison.simulation); // State for adjusted simulation data

  // create single plot
  const plot: LinePlotProps = {
    plotConfig: {
      xLabel: 'energy (eV)',
      yLabel: 'intensity (arb. units)',
    },
    lineData: [
      comparison.experiment.lineData[2], // Use the last line data from the experiment
      adjustedSimulation.lineData[0], // Use the first line data from the simulation
    ],
    xDomain: comparison.experiment.xDomain,
    yDomain: comparison.experiment.yDomain,
  };

  // Update adjusted simulation data whenever xOffset changes
  useEffect(() => {
    const adjustedLineData = comparison.simulation.lineData.map((line) => {
      const xArray = ndarray(new Float32Array(line.x.data)); // Copy the original x-axis data
      const yArray = ndarray(new Float32Array(line.y.data)); // Copy the original y-axis data
      const yMult = invertY ? -1 : 1; // Determine the multiplier for y-axis inversion
      ops.adds(xArray, xArray, xOffset); // Add offset to x-axis data
      ops.muls(yArray, yArray, yScale * yMult); // Scale the y-axis data
      return {
        ...line,
        x: xArray,
        y: yArray,
        label: 'Simulation', // Set the label for the simulation line
      };
    });

    setAdjustedSimulation({
      ...comparison.simulation,
      lineData: adjustedLineData,
    });
  }, [xOffset, yScale, invertY, comparison.simulation]);

  // useEffect(() => {
  //   const adjustedLineData = comparison.simulation.lineData.map((line) => {
  //     const yArray = ndarray(new Float32Array(line.y.data)); // Copy the original y-axis data
  //     ops.muls(yArray, yArray, yScale); // Scale the y-axis data
  //     return {
  //       ...line,
  //       y: yArray,
  //     };
  //   });

  //   setAdjustedSimulation({
  //     ...adjustedSimulation,
  //     lineData: adjustedLineData,
  //   });
  // }
  // , [yScale, adjustedSimulation]);

  return (
    <div className="my-window-grid">
      <div className="my-left-panel">
        <h3>Comparison</h3>
        <p>Adjust X-Axis Offset:</p>
        <input
          type="range"
          min={-10}
          max={10}
          step={0.1}
          value={xOffset}
          onChange={(e) => setXOffset(parseFloat(e.target.value))} // Update the offset
          style={{ width: '100%' }}
        />
        <p>Offset: {xOffset.toFixed(1)}</p>
        <p>Adjust Y-Axis Scale:</p>
        <input
          type="range"
          min={0.01}
          max={2*scale}
          step={0.01}
          value={yScale}
          onChange={(e) => setYScale(parseFloat(e.target.value))} // Update the scale
          style={{ width: '100%' }}
        />
        <p>Scale: {yScale.toFixed(2)}</p>
        <div>
          <label>
            <input
              type="checkbox"
              checked={invertY}
              onChange={(e) => setInvertY(e.target.checked)} // Toggle y-axis inversion
            />
            Invert simulation
          </label>
        </div>
      </div>
      <div className="my-right-panel">
        <DvDPlots lineProps={plot} />
        {/* <h3>Experiment</h3>
        <DvDPlots lineProps={comparison.experiment} />
        <h3>Simulation</h3>
        <DvDPlots lineProps={adjustedSimulation} /> */}
        <MarkdownPreview markdown={comparison.table ? comparison.table : ''} />
      </div>
    </div>
  );
}