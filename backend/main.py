import os 
import logging 
from typing import Any

from fastapi import FastAPI
from fastapi.responses import Response
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import msgpack
import numpy as np


from xds import gen_simulation, AVAILABLE_SYMMETRIES, lineProps


app = FastAPI()
logging.basicConfig()
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# def serialise(obj: dict):
#     return orjson.dumps(obj, default=None, option=orjson.OPT_SERIALIZE_NUMPY)


class SimulationInputs(BaseModel):
    ion: str
    charge: str
    symmetry: str
    beta: float
    tenDq: float
    bFieldX: float
    bFieldY: float
    bFieldZ: float
    hFieldX: float
    hFieldY: float
    hFieldZ: float
    temperature: float
    path: str


@app.get("/api/elements")
async def get_element():
    return AVAILABLE_SYMMETRIES


def encoder(obj) -> dict[str, Any]:
    if isinstance(obj, np.ndarray):
        logger.info(f"Encoding numpy array: {obj.dtype} {obj.dtype.kind} {obj.size} {obj}")
        # Create javascript NDarray like object
        obj = dict(
            nd=True, dtype=obj.dtype.str, shape=obj.shape, data=obj.data.tolist()
        )
        logger.info(f"Encoded numpy array: {obj}")
    return obj


@app.post("/api/submit")
async def submit_form(data: SimulationInputs):
    # Run Quanty
    logger.info('Now I run Quanty with the following parameters:\n', data)
    simulation = gen_simulation(
        ion=data.ion,
        ch_str=data.charge,
        symmetry=data.symmetry,
        beta=data.beta,
        dq=data.tenDq,
        mag_field=[data.bFieldX, data.bFieldY, data.bFieldZ],
        exchange_field=[data.hFieldX, data.hFieldY, data.hFieldZ],
        temperature=data.temperature,
        quanty_path=data.path,
    )
    logger.info(f"Running Quanty simulation: {simulation.label}")
    result = simulation.run_all()
    logger.debug(f"Simulation output: {result.stdout if result else 'None'}")
    logger.info(f"Analysing results of simulation: {simulation.label}")
    table, axis1, axis2 = simulation.analyse()
    data = {
        "message": f"simulation {simulation.label} succsefull", 
        "table": table, 
        "plot1": axis1, 
        "plot2": axis2
    }
    packed_data = msgpack.packb(data, use_bin_type=True, default=encoder)
    return Response(content=packed_data, media_type="application/x-msgpack")


INDEX = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))
logger.info(f'!!! Frontend: {INDEX}, isfile: {os.path.isfile(INDEX)}')
app.mount('/', StaticFiles(directory=INDEX, html=True), 'frontend')


if __name__ == "__main__":
    import uvicorn
    import webbrowser

    webbrowser.open_new_tab('http://localhost:8123/')
    # uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info", access_log=False, reload=True)
    uvicorn.run(app, host="0.0.0.0", port=8123, log_level="info")