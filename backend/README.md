# XDS WebApp
X-Ray Dichroism Simulations using Quanty

- By Dan Porter
- Diamond Light Source Ltd


### Installation
```
$ conda create -n xds_webapp nodejs python pnpm
$ conda activate xds_webapp
$ git clone https://github.com/DanPorter/xds_webapp.git

$ cd xds_webapp/frontend
$ pnpm install
$ pnpm build

$ cd xds_webapp/backend
$ python -m pip install .
$ python main.py
```

### Run (local)
```bash
$ conda activate xds_webapp
$ cd backend
$ python main.py
```