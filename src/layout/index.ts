/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { layoutFa2 } from './fa2'
import { layoutGrid } from './grid'
import { layoutRandom } from './random'
import { Layout } from './types'
import { layoutUmap } from './umap'
import { table } from 'arquero'

export * from './fa2'
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
	nodes?: table,
	edges?: table,
	options?: any,
) {
	switch (type) {
		case Layout.Random:
			return layoutRandom(nodes)
		case Layout.Grid:
			return layoutGrid(nodes)
		case Layout.FA2:
			return layoutFa2(edges, nodes, options)
		case Layout.UMAP:
			return layoutUmap(edges)
	}
}
