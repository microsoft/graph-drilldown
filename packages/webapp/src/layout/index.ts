/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { layoutGrid } from './grid'
import { layoutRandom } from './random'
import { Layout } from './types'
import { layoutUmap } from './umap'

export * from './grid'
export * from './random'
export * from './types'

/**
 * Helper to select and execute a supported layout.
 * Note that nodes are edges are marked optional: different
 * layouts have slightly different requirements.
 * @param type
 * @param nodes
 * @param edges
 * @param options
 */
export async function executeLayout(
	type: Layout,
	nodes?: ColumnTable,
	edges?: ColumnTable,
	options?: any,
) {
	switch (type) {
		case Layout.Random:
			return nodes && layoutRandom(nodes)
		case Layout.Grid:
			return nodes && layoutGrid(nodes)
		case Layout.UMAP:
			return edges && layoutUmap(edges)
	}
}
