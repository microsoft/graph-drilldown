/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { umapLayout } from '../api'
import { EdgeCollection, normalizeXY } from '../arquero'
import { from, table } from 'arquero'

/**
 * Runs our autolayout umap - note that this mostly just thunks over to the web service.
 * @param edges
 */
export async function layoutUmap(edges: table) {
	const positions = await umapLayout(new EdgeCollection(edges))
	const transformed = positions.map(n => ({
		'node.id': n.id,
		'node.x': n.x,
		'node.y': n.y,
		'node.d': n.d,
		'community.id': n.community,
	}))
	const nodes = from(transformed)
	return normalizeXY(nodes)
}
