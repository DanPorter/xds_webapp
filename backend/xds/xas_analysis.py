"""
Load experimental data from nexus files


"""

import os
import numpy as np
import hdfmap

from .environment import regex_scan_number
from .plot_models import gen_line_data, gen_plot_props

XAS_METADATA = {
    'cmd': '(cmd|scan_command)',
    'date': 'start_time',
    'pol': 'polarisation?("lh")',
    'iddgap': 'iddgap',
    'rowphase': 'idutrp if iddgap == 100 else iddtrp',
    'endstation': 'instrument_name',
    'temp': '(T_sample|lakeshore336_sample?(300))',
    'rot': '(scmth|xabs_theta|ddiff_theta?(0))',
    'field': 'np.sqrt(field_x?(0)**2 + field_y?(0)**2 + field_z?(0)**2)',
    'energy': '(fastEnergy|pgm_energy|energy)',
    'monitor': '(C2|ca62sr|mcs16|macr16|mcse16|macj316|mcsh16|macj216)',
    'tey': '(C1|ca61sr|mcs17|macr17|mcse17|macj317|mcsh17|macj217)',
    'tfy': '(C3|ca63sr|mcs18|macr18|mcse18|macj318|mcsh18|mcaj218)',
}


def average_energy_scans(*args: tuple[np.ndarray]):
    """Return the minimum range covered by all input arguments"""
    min_energy = np.max([np.min(en) for en in args])
    max_energy = np.min([np.max(en) for en in args])
    min_step = np.min([np.min(np.abs(np.diff(en))) for en in args])
    return np.arange(min_energy, max_energy + min_step, min_step)


def combine_energy_scans(energy, *args: tuple[np.ndarray, np.ndarray]):
    """Average energy scans, interpolating at given energy"""
    data = np.zeros([len(args), len(energy)])
    for n, (en, dat) in enumerate(args):
        data[n, :] = np.interp(energy, en, dat)
    return data.mean(axis=0)


class XASMeasurement:
    def __init__(self, filename: str, nexus_map: hdfmap.NexusMap):
        self.filename = filename
        self.basename = os.path.basename(filename)
        self.scan_number = int(regex_scan_number.search(self.basename)[0])
        self.map = nexus_map

        with hdfmap.load_hdf(filename) as hdf:
            self.cmd = self.map.eval(hdf, XAS_METADATA['cmd'])
            self.polarisation = self.map.eval(hdf, XAS_METADATA['pol'])
            self.temperature = self.map.eval(hdf, XAS_METADATA['temp'])
            self.field = self.map.eval(hdf, XAS_METADATA['field'])
            self.energy = self.map.eval(hdf, XAS_METADATA['energy'])
            if len(self.energy) <= 1:
                en_path = self.map.eval(hdf, '_' + XAS_METADATA['energy'])
                raise ValueError(f"Energy has the wrong shape: Energy [{self.energy.shape}]: {en_path}")
            default = np.ones_like(self.energy)
            self.monitor = self.map.eval(hdf, XAS_METADATA['monitor'], default=default)
            self.tey = self.map.eval(hdf, XAS_METADATA['tey'], default=default)
            self.tfy = self.map.eval(hdf, XAS_METADATA['tfy'], default=default)
        
        self.tey = self.tey / self.monitor
        self.tfy = self.tfy / self.monitor
        self.label = f"{self.scan_number}: {self.polarisation}"
    
    def __repr__(self):
        return f"XASMeasurement(#{self.scan_number}, '{self.polarisation}')"
    
    def plot(self):
        return gen_line_data(self.energy, self.tey, label=self.label)


class PolarisationPair:
    def __init__(self, measurement1: XASMeasurement, measurement2: XASMeasurement):
        self.measurement1 = measurement1
        self.measurement2 = measurement2

        # calculate difference
        av_energy = average_energy_scans(measurement1.energy, measurement2.energy)
        interp_pc = combine_energy_scans(av_energy, (measurement1.energy, measurement1.tey))
        interp_nc = combine_energy_scans(av_energy, (measurement2.energy, measurement2.tey))

        self.energy = av_energy
        self.difference = interp_pc - interp_nc
        self.temperature = (measurement1.temperature + measurement2.temperature) / 2
        self.field = (measurement1.field + measurement2.field) / 2

        self.title = (
            f"#{measurement1.scan_number}[{measurement1.polarisation}] - "
            f"#{measurement2.scan_number}[{measurement2.polarisation}]\n"# + 
            # f"Field = {round(self.field, 3): .3g} T, Temp = {round(self.temperature, 3): .3g} K"
        )
    
    def __repr__(self):
        return f"PolarisationPair({self.measurement1}, {self.measurement2})"
    
    def plot(self):
        return (
            gen_line_data(self.energy, self.difference, label=f"{self.measurement1.polarisation} - {self.measurement2.polarisation}", colour='red')
        )
    
    def output(self):
        lines = self.measurement1.plot(), self.measurement2.plot(), self.plot()
        return gen_plot_props(
            self.title,
            'Energy (eV)',
            'Difference (a.u.)',
            (self.energy.min(), self.energy.max()),
            (self.difference.min(), max(self.measurement1.tey.max(), self.measurement2.tey.max(), self.difference.max())),
            *lines
        )


class PolarisationSet:
    def __init__(self, *measurementPairs: PolarisationPair):
        self.measurements = measurementPairs

        # calculate difference
        av_energy = average_energy_scans(*[pair.energy for pair in measurementPairs])
        interp_pc = combine_energy_scans(av_energy, *[(pair.measurement1.energy, pair.measurement1.tey) for pair in measurementPairs])
        interp_nc = combine_energy_scans(av_energy, *[(pair.measurement2.energy, pair.measurement2.tey) for pair in measurementPairs])

        self.energy = av_energy
        self.xas1 = interp_pc 
        self.xas2 = interp_nc
        self.difference = interp_pc - interp_nc
        self.temperature = sum([pair.temperature for pair in measurementPairs]) / len(measurementPairs)
        self.field = sum([pair.field for pair in measurementPairs]) / len(measurementPairs)

        pol1 = self.measurements[0].measurement1.polarisation
        pol2 = self.measurements[0].measurement2.polarisation
        scans1 = ', '.join([str(pair.measurement1.scan_number) for pair in measurementPairs])
        scans2 = ', '.join([str(pair.measurement2.scan_number) for pair in measurementPairs])
        self.title = f"Average: [{pol1}]: #({scans1}), [{pol2}]: #({scans2})"

        self.pol1 = pol1 
        self.pol2 = pol2
    
    def __repr__(self):
        return f"PolarisationSet({self.measurements})"
    
    def plot(self):
        return (
            gen_line_data(self.energy, self.xas1, label=f"XAS {self.pol1}", colour='blue'),
            gen_line_data(self.energy, self.xas2, label=f"XAS {self.pol2}", colour='green'),
            gen_line_data(self.energy, self.difference, label=f"{self.pol1} - {self.pol2}", colour='red'),
        )
    
    def output(self):
        return gen_plot_props(
            self.title,
            'Energy (eV)',
            'Difference (a.u.)',
            (self.energy.min(), self.energy.max()),
            (self.difference.min(), max(self.xas1.max(), self.xas2.max(), self.difference.max())),
            *self.plot()
        )


def find_pairs(*filenames: str) -> list[PolarisationPair]:
    """
    returns pairs of xas measurements in paired polarisations (cl,cr or lh,lv etc)
    """
    if len(filenames) < 2:
        return []
    nexus_map = hdfmap.create_nexus_map(filenames[0])
    measurements = [XASMeasurement(filename, nexus_map) for filename in filenames]
    print('Measurements: ', measurements)
    polarisations = [m.polarisation for m in measurements]
    print('polarisations: ', polarisations)
    '''
    either, find matching pattern 'cl,cr,cr,cl', or find pairs of different polarisations
    '''
    pol_indexes = [
        [i for i, x in enumerate(polarisations) if x == pol]
        for pol in set(polarisations)
    ]
    if len(pol_indexes) < 2:
        raise Exception(f"Not enough polarisations! {set(polarisations)}")
    print(f"Pairing Polarisations: {polarisations[pol_indexes[0][0]]} and {polarisations[pol_indexes[1][0]]}")
    pairs = [
        PolarisationPair(measurements[i1], measurements[i2])
        for i1, i2 in zip(pol_indexes[0], pol_indexes[1])
    ]
    pol_set = PolarisationSet(*pairs)
    
    # pairs = [
    #     PolarisationPair(measurements[n], measurements[n+1]) 
    #     for n in range(0, len(measurements), 2) 
    #     # if (n + 1 < len(measurements) and measurements[n].polarisation != measurements[n+1].polarisation)
    # ]
    return [pair.output() for pair in pairs] + [pol_set.output()]

