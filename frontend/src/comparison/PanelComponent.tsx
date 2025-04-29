import { useState, useEffect } from 'react';
import MarkdownPreview from '../MarkdownTextBox';
import { DvDPlots } from '../DavidiaPlots';
import { ComparisonProps } from '../App';
import ndarray from 'ndarray';
import ops from 'ndarray-ops';

export default function ComparisonPanel(comparison: ComparisonProps) {
  const [xOffset, setXOffset] = useState(0); // State to manage the x-axis offset
  const [yScale, setYScale] = useState(1); // State to manage the y-axis scale
  const [adjustedSimulation, setAdjustedSimulation] = useState(comparison.simulation); // State for adjusted simulation data

  // Update adjusted simulation data whenever xOffset changes
  useEffect(() => {
    const adjustedLineData = comparison.simulation.lineData.map((line) => {
      const xArray = ndarray(new Float32Array(line.x.data)); // Copy the original x-axis data
      ops.adds(xArray, xArray, xOffset); // Add offset to x-axis data
      return {
        ...line,
        x: xArray,
      };
    });

    setAdjustedSimulation({
      ...comparison.simulation,
      lineData: adjustedLineData,
    });
  }, [xOffset, comparison.simulation]);

  useEffect(() => {
    const adjustedLineData = adjustedSimulation.lineData.map((line) => {
      const yArray = ndarray(new Float32Array(line.y.data)); // Copy the original y-axis data
      ops.muls(yArray, yArray, yScale); // Scale the y-axis data
      return {
        ...line,
        y: yArray,
      };
    });

    setAdjustedSimulation({
      ...adjustedSimulation,
      lineData: adjustedLineData,
    });
  }
  , [yScale, adjustedSimulation]);

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
          min={0.1}
          max={10}
          step={0.1}
          value={yScale}
          onChange={(e) => setYScale(parseFloat(e.target.value))} // Update the scale
          style={{ width: '100%' }}
        />
      </div>
      <div className="my-right-panel">
        <DvDPlots {...comparison.experiment} />
        <DvDPlots {...adjustedSimulation} />
        <MarkdownPreview markdown={comparison.table ? comparison.table : ''} />
      </div>
    </div>
  );
}