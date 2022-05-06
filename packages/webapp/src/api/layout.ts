/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { EdgeCollection } from '@graph-drilldown/arquero'

import { AUTOLAYOUT_URL } from '~/constants'

/**
 * Transforms an edge list to the POST payload JSON.
 * @param edges
 */
function edgesToPOST(edges: EdgeCollection) {
	return edges.map(e => ({
		source: e.source,
		target: e.target,
		weight: e.weight,
	}))
}

function createPOSTBody(edges: EdgeCollection) {
	return {
		layout_type: 'umap',
		// TODO: it could actually be directed
		is_directed: false,
		edges: edgesToPOST(edges),
	}
}

/**
 * This function invokes a service that uses graspologic autolayout.
 * It can be configured by assigning the AUTOLAYOUT_URL environment variable
 * at deployment time. If the variable is missing, the UMAP button will not be
 * visible in the interface.
 * See https://graspologic.readthedocs.io/en/latest/reference/layouts.html#automatic-graph-layout
 * @param edges
 * @returns
 */
export async function umapLayout(edges: EdgeCollection) {
	const body = createPOSTBody(edges)
	return fetch(AUTOLAYOUT_URL, {
		method: 'POST',
		mode: 'cors',
		body: JSON.stringify(body),
	})
		.then(res => res.json())
		.then(json =>
			json.positions.map(p => ({
				id: p.node_id,
				x: p.x,
				y: p.y,
				d: p.size,
				community: `${p.community}`,
			})),
		)
}
