

import DataPathSelector from './pathSelector';
import { fetchPolPairs } from './getData';
import { MeasurementProps } from '../App';


function MeasurementInputs( props: MeasurementProps) {
  return (
    <form className="form-container" onSubmit={(e) => fetchPolPairs(e, props)}>
      <h2>Experiment Data</h2>
      <DataPathSelector {...props} />
      <button type="submit" className="submit-button">Submit</button>
    </form>
  );
};

export default MeasurementInputs;