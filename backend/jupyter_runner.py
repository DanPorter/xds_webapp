"""
pip install fastapi uvicorn jupyter nest_asyncio
"""

from fastapi import FastAPI
from fastapi.responses import JSONResponse
from subprocess import Popen
import nest_asyncio
import uvicorn
import secrets
import requests

app = FastAPI()

# Generate a secure token
jupyter_token = secrets.token_hex(32)

# Start Jupyter Notebook server
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup event
    Popen(["jupyter", "notebook", "--no-browser", "--allow-root", f"--NotebookApp.token={jupyter_token}"])
    yield
    # Shutdown event (if needed)

app = FastAPI(lifespan=lifespan)

@app.post("/start-notebook/")
async def start_notebook():
    # Create a new Jupyter session
    response = requests.post('http://localhost:8888/api/sessions', json={
        'name': '',
        'path': 'notebook.ipynb',
        'type': 'notebook',
        'kernel': {
            'name': 'python3'
        }
    })
    session = response.json()
    notebook_url = f"http://localhost:8888/notebooks/{session['path']}?token={jupyter_token}"
    return JSONResponse(content={"notebook_url": notebook_url})

if __name__ == "__main__":
    nest_asyncio.apply()
    uvicorn.run(app, host="0.0.0.0", port=8000)