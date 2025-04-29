
// import './FormComponent.css';
import handleSubmit from './handleSubmit';
import DataPathSelector from './pathSelector';
import { MeasurementProps } from '../App';


function MeasurementInputs( props: MeasurementProps) {
  return (
    <form className="form-container" onSubmit={(e) => handleSubmit(e, props)}>
      <h2>Experiment Data</h2>
      <DataPathSelector {...props} />
      <button type="submit" className="submit-button">Submit</button>
    </form>
  );
};

export default MeasurementInputs;