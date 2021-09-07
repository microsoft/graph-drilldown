This contains a few sample synthetic graph datasets. They can be loaded into the app using query parameters:

`?dataset=synthetic_1` for example will load the first synthetic dataset

Individual files can also be loaded:

`?nodes=data/synthetic_1/nodes.csv` will load just the nodes file, `?nodes=data/synthetic_1/nodes.csv&edges=data/synthetic_1/edges.csv` will load the nodes and edges files. Supported "keys" are `nodes`, `edges`, `join`, and `communities`.