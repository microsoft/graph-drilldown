/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { EdgeCollection, normalizeXY } from '@graph-drilldown/arquero'
import { from } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { umapLayout } from '../api'

/**
 * Runs our autolayout umap - note that this mostly just thunks over to the web service.
 * @param edges
 */
export async function layoutUmap(edges: ColumnTable) {
	const positions = await umapLayout(new EdgeCollection(edges))
	const transformed = positions.map((n) => ({
		'node.id': n.id,
		'node.x': n.x,
		'node.y': n.y,
		'node.d': n.d,
		'community.id': n.community,
	}))
	const nodes = from(transformed)
	return normalizeXY(nodes)
}
