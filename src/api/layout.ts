/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { EdgeCollection } from '~/arquero'
import { AUTOLAYOUT_URL } from '~/constants'

/**
 * Transforms and edge list to the POST payload JSON.
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
