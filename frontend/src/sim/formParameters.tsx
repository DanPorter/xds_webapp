

const QUANTY_PATH = 'C:\\Users\\grp66007\\Documents\\quanty\\quanty_win\\QuantyWin64.exe';//'Quanty';

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

export interface FormData {
  ion: string;
  charge: string;
  symmetry: string;
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

export const defaults: FormData = {
  ion: '',
  charge: '',
  symmetry: '',
  beta: 0.8,
  tenDq: 1.0,
  bFieldX: 0.0,
  bFieldY: 0.0,
  bFieldZ: 1.0,
  hFieldX: 0.0,
  hFieldY: 0.0,
  hFieldZ: 0.0,
  temperature: 1.0,
  path: QUANTY_PATH,
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