/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { normalizeXY } from '@graph-drilldown/arquero'

/**
 * Assigns node positions by unrolling into a square grid.
 * This can be useful when nodes are sorted by a grouping field,
 * as it will consolidate blocks of color in strips.
 * @param nodes
 */
export async function layoutGrid(nodes: ColumnTable): Promise<ColumnTable> {
	return new Promise(resolve => {
		const ranked = nodes
			.params({
				rows: nodes.numRows(),
				root: Math.sqrt(nodes.numRows()),
			})
			.derive({
				row: op.row_number(),
			})
			.derive({
				'node.y': (d: any, $: any) => {
					const r = Math.floor(d.row / $.root)
					const baseY = (1 / $.root) * r
					return 1 - baseY - 1 / $.root
				},
				'node.x': (d: any, $: any) => {
					const r = Math.floor(d.row / $.root)
					const col = d.row - r * $.root
					return (1 / $.root) * col
				},
			})
		const normalized = normalizeXY(ranked)
		resolve(normalized)
	})
}
