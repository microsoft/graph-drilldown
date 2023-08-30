/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'
/**
 * Randomly assign x/y positions to a table of nodes
 * @param table
 */
export async function layoutRandom(nodes: ColumnTable): Promise<ColumnTable> {
	return new Promise((resolve) => {
		resolve(
			nodes.derive({
				'node.x': () => Math.random(),
				'node.y': () => Math.random(),
			}),
		)
	})
}
