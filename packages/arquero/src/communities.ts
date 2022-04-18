/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { NodeCollection } from '@graph-drilldown/arquero'
import { table } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { findGroupIndices } from './table.js'

/**
 * Gets a table of just the nodes for a matching community.
 * The preferred outcome here is to use the grouped-by-parent table,
 * because this retains child community differentiability.
 * However, if the selected community is a leaf in the hierarchy,
 * it will have no child communities and therefore filtering by 'parent'
 * will not return it (because there are no rows with this cid as parent).
 * In this case, we use the grouped-by-community variant to get the nodes.
 * @param cid
 * @param byParent
 * @param byCommunity
 */
export function findNodesTableForCommunity(
	cid: string | undefined,
	byParent: ColumnTable,
	byCommunity: ColumnTable,
) {
	if (!cid) {
		return table({})
	}

	const pidx = findGroupIndices(byParent, 'community.pid', cid)
	const cidx = findGroupIndices(byCommunity, 'community.id', cid)

	const indices = pidx || cidx
	const tbl = pidx ? byParent : byCommunity

	return tbl.reify(indices)
}

// this is duplicative of findNodesTableForCommunity, but retaining the indices allows us to avoid reify
export function findNodesCollectionForCommunity(
	cid: string | undefined,
	byParent: ColumnTable,
	byCommunity: ColumnTable,
) {
	if (!cid) {
		return new NodeCollection()
	}

	const pidx = findGroupIndices(byParent, 'community.pid', cid)
	const cidx = findGroupIndices(byCommunity, 'community.id', cid)

	const indices = pidx || cidx
	const tbl = pidx ? byParent : byCommunity

	return new NodeCollection(tbl, indices)
}

/**
 * Find all of the node rows for communities that share a parent.
 * @param pid
 * @param byParent
 */
export function findNodesTableForParent(pid: string, byParent: ColumnTable) {
	const pidx = findGroupIndices(byParent, 'community.pid', pid)
	return byParent.reify(pidx)
}
