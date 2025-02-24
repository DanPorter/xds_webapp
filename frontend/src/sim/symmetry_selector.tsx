import React from 'react';
import { useState, useEffect } from 'react';


interface ElementData {
  [key: string]: {
    [key: string]: string[];
  };
}

interface SymSelectProps {
  formChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SymmetrySelector: React.FC<SymSelectProps> = ({ formChange }) => {
  const [data, setData] = useState<ElementData>({});
  const [selectedElement, setSelectedElement] = useState<string>('');
  const [selectedCharge, setSelectedCharge] = useState<string>('');
  const [selectedSymmetry, setSelectedSymmetry] = useState<string>('');
  const [charges, setCharges] = useState<string[]>([]);
  const [symmetries, setSymmetries] = useState<string[]>([]);

  // load local atom data parameters
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/elements');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleElementChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const element = event.target.value;
    setSelectedElement(element);
    setSelectedCharge('');
    setSelectedSymmetry('');
    setSymmetries([]);
    setCharges(Object.keys(data[element] || {}));
    formChange(event);
  };

  const handleChargeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const charge = event.target.value;
    setSelectedCharge(charge);
    setSymmetries(data[selectedElement][charge] || []);
    setSelectedSymmetry('');
    formChange(event);
  };

  const handleSymmetryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const symmetry = event.target.value;
    setSelectedSymmetry(symmetry);
    formChange(event);
  };

  return (
    <>
      <div className="form-group">
        <label>Element:</label>
        <select name="ion" value={selectedElement} onChange={handleElementChange}>
          <option value="">Select Element</option>
          {Object.keys(data).map((element) => (
            <option key={element} value={element}>
              {element}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Charge:</label>
        <select name="charge" value={selectedCharge} onChange={handleChargeChange} disabled={!selectedElement}>
          <option value="">Select Charge</option>
          {charges.map((charge) => (
            <option key={charge} value={charge}>
              {charge}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label >Symmetry:</label>
        <select name="symmetry" value={selectedSymmetry} disabled={!selectedCharge} onChange={handleSymmetryChange}>
          <option value="">Select Symmetry</option>
          {symmetries.map((symmetry) => (
            <option key={symmetry} value={symmetry}>
              {symmetry}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default SymmetrySelector;


// function SymmetrySelect({ value, description, onChange, error }: IonSelectProps) {

//   const [elements, setElements] = useState({});
//   const [charges, setCharges] = useState<string[]>([]);
//   const [symmetries, setSymmetries] = useState<string[]>([]);
//   getElements(setElements)(); // populate elements from local json object

//   const elementOptions = Object.keys(elements).map(key => 
//     <option value={key}>{key}</option>
//   )

//   const elementChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//       const { name, value } = e.target;
//       ch = elements[value]
//       setCharges(Object.keys(elements[value]).keys())
//       onChange(e);
//     };

//   return (
//     <div className="form-group">
//       <label title={description}>Ion:</label>
//       <select name='ion' title={description} value={value} onChange={onChange}>
//         <option value="" title="Select an element">--Select an element--</option>
//         {elementOptions}
//       </select>
//       {error && <span className="error">{error}</span>}
//     </div>
//   )
// }



// const IonSelect: React.FC<IonSelectProps> = ({ value, description, onChange, error }) => (
//   <div className="form-group">
//     <label title={description}>Ion:</label>
//     <select name="ion" title={description} value={value} onChange={onChange}>
//       <option value="" title="Select an element">--Select an element--</option>
//       <option value="Ti" title="Titanium (Ti) - Atomic number 22">Titanium (Ti)</option>
//       <option value="V" title="Vanadium (V) - Atomic number 23">Vanadium (V)</option>
//       <option value="Cr" title="Chromium (Cr) - Atomic number 24">Chromium (Cr)</option>
//       <option value="Mn" title="Manganese (Mn) - Atomic number 25">Manganese (Mn)</option>
//       <option value="Fe" title="Iron (Fe) - Atomic number 26">Iron (Fe)</option>
//       <option value="Co" title="Cobalt (Co) - Atomic number 27">Cobalt (Co)</option>
//       <option value="Ni" title="Nickel (Ni) - Atomic number 28">Nickel (Ni)</option>
//       <option value="Cu" title="Copper (Cu) - Atomic number 29">Copper (Cu)</option>
//     </select>
//     {error && <span className="error">{error}</span>}
//   </div>
// );

// export default IonSelect;