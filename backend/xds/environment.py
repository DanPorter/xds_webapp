"""
Check environment variables and file system
"""

import os
import re
import subprocess
from datetime import datetime

# environment variables on beamline computers
BEAMLINE = 'BEAMLINE'
USER = ['USER', 'USERNAME']
DLS = '/dls'
MMG_BEAMLINES = ['i06', 'i06-1', 'i06-2', 'i10', 'i10-1', 'i16', 'i21']

# Initialise available beamlines
YEAR = str(datetime.now().year)
AVAILABLE_EXPIDS = {
    beamline: sorted(
            (file.path for file in os.scandir(os.path.join(DLS, beamline, 'data', YEAR)) 
             if file.is_dir() and os.access(file.path, os.R_OK)),
            key=lambda x: os.path.getmtime(x)
        )
        for beamline in MMG_BEAMLINES
} if os.path.isdir(DLS) else {}


def get_beamline():
    """Return current beamline from environment variable"""
    return os.environ.get(BEAMLINE, '')


def get_user():
    """Return current user from environment variable"""
    return next((os.environ[u] for u in USER if u in os.environ), '')


def get_dls_visits(instrument: str | None = None, year: str | int | None = None) -> dict[str]:
    """Return list of visits"""
    if instrument is None:
        instrument = get_beamline()
    if year is None:
        year = datetime.now().year
    
    dls_dir = os.path.join(DLS, instrument.lower(), 'data', str(year))
    if os.path.isdir(dls_dir):
        return {p.name: p.path for p in os.scandir(dls_dir) if p.is_dir() and p.accessible()}
    return {}


def list_files(folder_directory: str, extension='.nxs') -> list[str]:
    """Return list of files in directory with extension, returning list of full file paths"""
    # return [os.path.join(folder_directory, file) for file in os.listdir(folder_directory) if file.endswith(extension)]
    try:
        return sorted(
            (file.path for file in os.scandir(folder_directory) if file.is_file() and file.name.endswith(extension)),
            key=lambda x: os.path.getmtime(x)
        )
    except (FileNotFoundError, PermissionError, OSError):
        return []


def list_scan_numbers(*paths) -> list[int]:
    """Return list of scan numbers in directory"""
    re_num = re.compile(r'\d{4,}')
    return sorted(
        (int(number[0]) for file in paths if (number := re_num.search(os.path.basename(file))) is not None),
    )


def get_scan_files(folder_directory: str) -> dict[int, str]:
    """Return dictionary of scan numbers and file paths"""
    filepaths = list_files(folder_directory)
    re_num = re.compile(r'\d{4,}')
    return {
        int(number[0]): path for path in filepaths 
        if (number := re_num.search(os.path.basename(path))) is not None
    }


def run_command(command):
    """
    Run shell command, print output to terminal
    """
    print('\n\n\n################# Starting ###################')
    print(f"Running command:\n{command}\n\n\n")
    output = subprocess.run(command, shell=True, capture_output=True)
    print(output.stdout.decode())
    print('\n\n\n################# Finished ###################\n\n\n')


