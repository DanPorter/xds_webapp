
import os
import subprocess
import numpy as np
from tabulate import tabulate

from .integrate import trapz, romb
from .plot_models import gen_lineData, gen_lineProps


def process_results(ion: str, path: str, Nelec: float, edge: float, Rawout: subprocess.CompletedProcess):
    """
    Analyse completed Quanty simulation
    """

    label = ion + '_XAS'
    xz = np.loadtxt(os.path.join(path, label + '_iso.spec'), skiprows=5)
    mcd = np.loadtxt(os.path.join(path, label + '_cd.spec'), skiprows=5)
    xl = np.loadtxt(os.path.join(path, label + '_l.spec'), skiprows=5)
    xr = np.loadtxt(os.path.join(path, label + '_r.spec'), skiprows=5)
    mcd2 = xr.copy()
    mcd2[:, 2] = xl[:, 2] - xr[:, 2]
    npts = np.shape(xz)[0]
    mcd2 = mcd
    # TOTAL spectra
    xas = xz.copy()
    xas[:, 2] = xz[:, 2] + xl[:, 2] + xr[:, 2]

    xas0 = xz.copy()
    xas0[:, 2] = (xl[:, 2] + xr[:, 2]) / 2 + xl[:, 2] + xr[:, 2]

    dx = xz.copy()
    dx[:, 2] = xl[:, 2] + xr[:, 2] - 2 * xz[:, 2]
    # ### Integration using Trapezoidal rule

    nh = 10 - Nelec #  params['Nelec']

    use_trapz = False
    if use_trapz:
        tot = trapz(xas[:, 2], xas[:, 0])
        tot0 = trapz(xas0[:, 2], xas0[:, 0])
        dx0 = trapz(dx[:, 2], dx[:, 0])
    else:
        tot = romb(xas[:, 2], dx=float(xas[1, 0] - xas[0, 0]))
        tot0 = romb(xas0[:, 2], dx=float(xas0[1, 0] - xas0[0, 0]))
        dx0 = romb(dx[:, 2], dx=float(dx[1, 0] - dx[0, 0]))

    deltaXas = dx0 / tot

    if use_trapz:
        lz = -2 * nh * trapz(mcd2[:, 2], mcd2[:, 0]) / tot
        szef = 3 / 2 * nh * (
                trapz(mcd2[0:npts // 2, 2], mcd2[0:npts // 2, 0]) -
                2 * trapz(mcd2[npts // 2:, 2], mcd2[npts // 2:, 0])
        ) / tot
        lz0 = -2 * nh * trapz(mcd2[:, 2], mcd2[:, 0]) / tot0
        szef0 = 3 / 2 * nh * (
                trapz(mcd2[0:npts // 2, 2], mcd2[0:npts // 2, 0]) -
                2 * trapz(mcd2[npts // 2:, 2], mcd2[npts // 2:, 0])
        ) / tot0
    else:
        print(len(mcd2[npts // 2:, 2]), len(mcd2[0:npts // 2 + 1]))
        mydelta = mcd2[1, 0] - mcd2[0, 0]
        lz = -2 * nh * romb(mcd2[:, 2], float(mydelta)) / tot
        szef = 3 / 2 * nh * (
                romb(mcd2[0:npts // 2 + 1, 2], float(mydelta)) -
                2 * romb(mcd2[npts // 2:, 2], float(mydelta))
        ) / tot
        lz0 = -2 * nh * romb(mcd2[:, 2], float(mydelta)) / tot0
        szef0 = 3 / 2 * nh * (
                romb(mcd2[0:npts // 2 + 1, 2], float(mydelta)) -
                2 * romb(mcd2[npts // 2:, 2], float(mydelta))
        ) / tot0

    # Sum rules table
    outdic = treat_output(Rawout)
    Lz_t = float(outdic['L_k'])
    Sz_t = float(outdic['S_k'])
    Tz_t = float(outdic['T_k'])
    Seff_t = float(outdic['S_k']) + float(outdic['T_k'])

    table1 = [[r'L$_z$', r'S$_{eff}$', r'S$_{z}$', r'T$_{z}$'],
                [Lz_t, Seff_t, Sz_t, Tz_t]]
    table2 = [[r'sL$_z$', 'sS$_{eff}$'], [lz, szef]]
    table3 = [[r's$_0$L$_z$', 's$_0$S$_{eff}$'], [lz0, szef0]]
    table4 = [[r'$\Delta$XAS (%)', r'$\Delta$L$_{z}$ (%)', r'$\Delta$S$_{eff}$ (%)',
                r'$\Delta_0$L$_{z}$ (%)', r'$\Delta_0$S$_{eff}$ (%)'],
                [deltaXas * 100, 100 * (abs(Lz_t) - abs(lz)) / Lz_t,
                100 * (abs(Seff_t) - abs(szef)) / Seff_t,
                100 * (abs(Lz_t) - abs(lz0)) / Lz_t,
                100 * (abs(Seff_t) - abs(szef0)) / Seff_t]]
    
    tfmt = 'html'
    table_string = '\n'.join([
        "<h1>Theoretical values (Quanty)</h1>",
        tabulate(table1, headers='firstrow', tablefmt=tfmt),
        "<h3>Sum rules :<\h3>",
        tabulate(table2, headers='firstrow', tablefmt=tfmt),
        "<h3>Sum rules 0:<\h3>",
        tabulate(table3, headers='firstrow', tablefmt=tfmt),
        "<h3>Deviations:<\h3>",
        tabulate(table4, headers='firstrow', tablefmt=tfmt)
    ])

    # Plots
    lines = [
        gen_lineData(xz[:, 0] + edge, xz[:, 2], 'r-', label='z-pol'),
        gen_lineData(xl[:, 0] + edge, xl[:, 2], 'b', label='left'),
        gen_lineData(xr[:, 0] + edge, xr[:, 2], 'g', label='right'),
    ]
    xlim = (-10 + edge, 20 + edge)
    axis1 = gen_lineProps('XAS', 'Energy [eV]', 'Intensity [a.u.]', xlim, None, *lines)

    lines = [
        gen_lineData(xas[:, 0] + edge, xas[:, 2] / 3, 'k', label='average'),
        gen_lineData(mcd[0:npts // 2, 0] + edge, mcd[0:npts // 2, 2], 'r', label=r'L$_3$'),
        gen_lineData(mcd[npts // 2:, 0] + edge, mcd[npts // 2:, 2], 'b', label=r'L$_2$'),
    ]
    axis2 = gen_lineProps('XMCD', 'Energy [eV]', 'Intensity [a.u.]', xlim, None, *lines)
    return table_string, axis1, axis2

    

def post_proc_output_only(ion: str, path: str, edge: str):

    label = ion + '_XAS'
    xz = np.loadtxt(os.path.join(path, label + '_iso.spec'), skiprows=5)
    mcd = np.loadtxt(os.path.join(path, label + '_cd.spec'), skiprows=5)
    xl = np.loadtxt(os.path.join(path, label + '_l.spec'), skiprows=5)
    xr = np.loadtxt(os.path.join(path, label + '_r.spec'), skiprows=5)

    mcd2 = xr.copy()
    mcd2[:, 2] = xl[:, 2] - xr[:, 2]

    # TOTAL spectra
    xas = xz.copy()
    xas[:, 2] = xz[:, 2] + xl[:, 2] + xr[:, 2]

    xas0 = xz.copy()
    xas0[:, 2] = (xl[:, 2] + xr[:, 2]) / 2 + xl[:, 2] + xr[:, 2]

    dx = xz.copy()
    dx[:, 2] = xl[:, 2] + xr[:, 2] - 2 * xz[:, 2]

    # element_data = self.xdat['elements'][self.ion]['charges'][self.charge]
    # iondata = element_data['symmetries'][self.symm]['experiments']['XAS']['edges']
    # edge = iondata['L2,3 (2p)']['axes'][0][4]

    output = {
        'zpol_energy': xz[:, 0] + edge,
        'zpol_xas': xz[:, 2],
        'xas_left_energy': xl[:, 0] + edge,
        'xas_left': xl[:, 2],
        'xas_right_energy': xr[:, 0] + edge,
        'xas_right': xr[:, 2],
        'average_energy': xas[:, 0] + edge,
        'average': xas[:, 2] / 3,
        'xmcd_energy': mcd[:, 0] + edge,
        'xmcd': mcd[:, 2],
    }
    return output


def treat_output(Rawout: subprocess.CompletedProcess):
    """
    From the standar output of a Quanty calculation with the XAS_Template,
    it extracts the relevant expctation value

    Arguments:
        Rawout   : a subprocess CompltedProcess object

    Returns:
        A dictionary with the relevant expectation values

    """
    out = Rawout.stdout.split('\n')
    rline = 0
    for iline in range(len(out)):
        if '!*!' in out[iline]:
            # print(out[iline-2])
            # print(out[iline])
            rline = iline

    Odata = out[rline].split()
    E = Odata[2]
    S2 = Odata[3]
    L2 = Odata[4]
    J2 = Odata[5]
    S_k = Odata[6]
    L_k = Odata[7]
    J_k = Odata[8]
    T_k = Odata[9]
    LdotS = Odata[10]
    return {'E': E, 'S2': S2, 'L2': L2, 'J2': J2, 'S_k': S_k, 'L_k': L_k, 'J_k': J_k, 'T_k': T_k, 'LdotS': LdotS}

