


export const tooltips: {[id: string]: string} = {
    ion: 'Atomic element',
    charge: 'ionic charge (integer)',
    symmetry: 'site symmetry',
    beta: 'Universal scaling parameter for the Slater integrals (beta)',
    tenDq: 'Crystal Field Splitting (10Dq) [eV]',
    bField: 'External magnetic field, (Bext) [Tesla]',
    hField: 'Exchange field (H) [eV]',
    temperature: 'Temperature [Kelvin]',
    path: 'Path of the Quanty Executable',
    Oh: "Octahedral symmetry",
    Td: "Tetrahedral symmetry",
    D4h: "Square planar symmetry",
    C3v: "Trigonal pyramidal symmetry",
    C2v: "Bent or angular symmetry",
}

export interface FormErrors {
  ion?: string;
  charge?: string;
  symmetry?: string;
  beta?: string;
  tenDq?: string;
  bField?: string;
  hField?: string;
  temperature?: string;
  path?: string;
}