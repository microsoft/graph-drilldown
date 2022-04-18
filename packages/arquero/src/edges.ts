/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { NodeCollection } from '@graph-drilldown/arquero'
import { desc, op, table } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

export function getEdgesFromTableByID(
	selectedId: string,
	nodeTable: ColumnTable,
	edges: ColumnTable,
) {
	if (selectedId) {
		console.log('selected id', selectedId)
		const joinedTable = joinNodeCommunities(edges, nodeTable)
		const neighborTable = getNeighbors(selectedId, joinedTable, nodeTable)
		return neighborTable
	}
}

// joins the community ids for edge source/target into the edge table
function joinNodeCommunities(
	edges: ColumnTable,
	nodes: ColumnTable,
): ColumnTable {
	if (edges.numRows() === 0) {
		return table({})
	}

	const derived = edges
		.params({
			cids: hashNodeField(nodes, 'community.id'),
		})
		.derive({
			'source.community': (d: any, $: any) => $.cids[d['edge.source']],
			'target.community': (d: any, $: any) => $.cids[d['edge.target']],
		})

	return derived
}

function hashNodeField(nodes: ColumnTable, field: string) {
	const hash: any = {}
	const id = nodes.getter('node.id')
	const cid = nodes.getter(field)
	nodes.scan(idx => (hash[id(idx)] = cid(idx)))
	return hash
}

// for a given community, finds all the connected sibling counts via edges
function getNeighbors(
	selectedId: string,
	joined: ColumnTable,
	nodes: ColumnTable,
): ColumnTable {
	if (joined.numRows() === 0 && nodes.numRows() === 0) {
		return table({})
	}

	const cFiltered = joined
		.params({
			cid: selectedId,
		})
		.filter(
			(d: any, $: any) =>
				d['source.community'] === $.cid || d['target.community'] === $.cid,
		)
	// the joined table has communities for the source and target of each edge row
	// this leaves  a groupby and rollup - group by the communities, and then count the links
	// groupby accepts multiple column keys, so it will create groups that match both
	const grouped = cFiltered.groupby({
		key: (d: any, $: any) => {
			if (d['source.community'] !== $.cid) {
				return d['source.community']
			}
			return d['target.community']
		},
	})

	// count is a built in rollup shortcut - it will count the number of rows in each joined group
	// the output is a new table with the results - i.e., a row for each count
	// this is now a count of the edges between the source and target communities
	const counted = grouped.count().orderby(desc('count'))
	// add back the nodecount
	const newJoined = counted.lookup(nodes, ['key', 'community.id'], {
		members: (d: any) => d['community.nodeCount'],
	})
	return newJoined
}

/**
 * Filters an edge list to only include connections between the nodes in the provided collection
 * @param edges - edge table
 * @param nodes - nodes to filter with (as source/target)
 */
export function filterEdgesToNodes(
	edges: ColumnTable,
	nodes: NodeCollection,
): ColumnTable {
	if (edges.numRows() === 0) {
		return edges
	}

	// note the manual hash: op.has does NOT work with Maps
	const nodeIds: any = {}
	nodes.forEach(node => (nodeIds[node.id] = true))
	return edges
		.params({
			nodeIds,
		})
		.filter(
			(d: any, $: any) =>
				op.has($.nodeIds, d['edge.source']) &&
				op.has($.nodeIds, d['edge.target']),
		)
}
