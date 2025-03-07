// Panel component in App.tsx

import { LinePlotProps, PlotConfig } from '@diamondlightsource/davidia';
import MarkdownPreview from '../MarkdownTextBox';
import { DvDPlots } from '../DavidiaPlots';
import { Comparison } from '../App';


export default
function ComparisonPanel(comparison: Comparison) {

  const xasPlots = {
    plotConfig: {
      xLabel: 'E [eV]',
      yLabel: 'XAS Signal [a. u.]',
      title: 'XAS',
    } as PlotConfig,
    lineData: [
      comparison.xasLines?.experimentPol1,
      comparison.xasLines?.experimentPol2,
      comparison.xasLines?.simulationPol1,
      comparison.xasLines?.simulationPol2,
    ],
    // xDomain: [0, 11],
    // yDomain: [0, 101],
  } as LinePlotProps;

  const diffPlots = {
    plotConfig: {
      xLabel: 'E [eV]',
      yLabel: 'Difference [a. u.]',
      title: 'Difference',
    } as PlotConfig,
    lineData: [
      comparison.xasLines?.experimentPol1,
      comparison.xasLines?.experimentPol2,
      comparison.xasLines?.simulationPol1,
      comparison.xasLines?.simulationPol2,
    ],
    // xDomain: [0, 11],
    // yDomain: [0, 101],
  } as LinePlotProps;

  return (
    <div className='my-window-grid'>
      <div className='my-left-panel'>
        <h3>Comparison</h3>
      </div>
      <div className='my-right-panel'>
        <DvDPlots {...xasPlots} />
        <DvDPlots {...diffPlots} />
        <MarkdownPreview markdown={comparison.table ? comparison.table : ''} />
      </div>
    </div>
  )
};