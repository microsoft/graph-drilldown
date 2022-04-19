/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableCollection } from '@graph-drilldown/arquero'
import {
	CommunityCollection,
	EdgeCollection,
	findNodesCollectionForCommunity,
	listColumnDefs,
	NodeCollection,
} from '@graph-drilldown/arquero'
import type {
	ColumnDef,
	Community,
	Edge,
	ItemType,
} from '@graph-drilldown/types'
import type { PositionMap } from '@graspologic/graph'
import { not, table } from 'arquero'
import { useCallback, useMemo } from 'react'

import {
	useBigTable,
	useCommunitiesTable,
	useCommunityNodesTable,
	useEdgeTable,
	useGroupedByCommunityTable,
	useGroupedByParentTable,
	useHoveredCommunity,
	useSelectedCommunity,
	useSetBigTable,
	useUniqueNodes,
} from '~/state'

import { ROOT_COMMUNITY_ID } from '../constants'
import { deriveLayoutPositions, deriveSmallMultiplePositions } from './layout'

export function useRemoveColumns() {
	const bigTable = useBigTable()
	const setBigTable = useSetBigTable()
	return useCallback(
		(columnNames: string[]) => {
			// TODO: we could inadvertently use this to remove required columns, such as node.id which should be blocked
			// TODO: if a removed column is the current visual encoding, it will error - find a fallback
			console.log('removing columns', columnNames)
			const derived = bigTable.select(not(columnNames))
			derived.print()
			setBigTable(derived)
		},
		[bigTable, setBigTable],
	)
}

const fixed = new Set([
	'node.id',
	'node.x',
	'node.y',
	'node.d',
	'community.id',
	'community.pid',
	'community.childCount',
	'community.nodeCount',
])

export function useColumnList(): ColumnDef[] {
	const bigTable = useBigTable()
	return useMemo(() => listColumnDefs(bigTable, fixed), [bigTable])
}

export function useNodeCount() {
	const nodes = useUniqueNodes()
	return nodes.size
}

export function useEdgeCount() {
	const edges = useEdgeTable()
	return edges.numRows()
}

// visible communities are always derived from the selected parent
export function useVisibleCommunities() {
	const pid = useSelectedCommunity()
	const communities = useCommunitiesTable()
	const tbl = useMemo(() => {
		if (communities.numCols() > 0 && pid) {
			const filtered = communities
				.params({
					pid,
				})
				.filter((d: any, $: any) => d['community.pid'] === $.pid)
				.ungroup()
			return filtered
		}
		return table({})
	}, [pid, communities])
	return useMemo(() => new CommunityCollection(tbl), [tbl])
}

// we would prefer the visible nodes to be derived using the parent community
// this ensures that each node has the properties of the child community it resides in
// however, if we select a leaf community with no children, there will be no child entries
// when filtering by parent - in this case, just return the nodes for that community
export function useVisibleNodes() {
	const table = useVisibleNodesTable()
	return useMemo(() => new NodeCollection(table), [table])
}

export function useVisibleNodesTable() {
	const pid = useSelectedCommunity()
	return useCommunityNodesTable(pid)
}

// TODO: actually filter this
export function useArqueroVisibleEdges(id?: string) {
	const edges = useEdgeTable()
	return useMemo(() => new EdgeCollection(edges), [edges])
}

export function useHoveredNodes() {
	const hovered = useHoveredCommunity()
	const byParent = useGroupedByParentTable()
	const byCommunity = useGroupedByCommunityTable()
	return useMemo(
		() => findNodesCollectionForCommunity(hovered, byParent, byCommunity),
		[hovered, byParent, byCommunity],
	)
}

export function useSelectedNodes() {
	const selected = useSelectedCommunity()
	const table = useVisibleNodesTable()
	return useMemo(
		() =>
			new NodeCollection(selected === ROOT_COMMUNITY_ID ? undefined : table),
		[selected, table],
	)
}

export function useTableColumnsByType(dataType: string) {
	// const byCommunity = useGroupedByCommunityTable()
	const bigTable = useBigTable()

	if (bigTable.numRows() > 0) {
		const def = listColumnDefs(bigTable)
		const columns = def.filter(d => d.dataType === dataType).map(d => d.name)
		const valueTable = bigTable.select(columns)
		return valueTable
	}
	return table({})
}

// for a list of communities, get a map of [cid]: nodepositions[]
export function useStandardNodePositions() {
	const table = useVisibleNodesTable()
	return useMemo(() => deriveLayoutPositions(table), [table])
}

export function useGriddedNodePositions(compute?: boolean) {
	const nodes = useVisibleNodesTable()
	const positions = useMemo(() => {
		if (compute) {
			return deriveSmallMultiplePositions(nodes)
		}
		return {} as PositionMap
	}, [nodes, compute])
	return positions
}

// Get Column array for given table. ColAttribute specify col prefix of interest. If non present, return all
// hiddenFields is optional parameter specifying fields that will not be return in hook
export function useColumnArray(
	collection: TableCollection<Node | Community | Edge>,
	colAttribute: ItemType[] | undefined,
	hiddenFields: string[] | undefined,
): string[] {
	return useMemo(() => {
		const allColumns = collection.table.columnNames()
		if (allColumns.length > 0) {
			return allColumns.reduce((acc, col) => {
				const split = col.split('.')
				const [prefix, value] = split
				const hidden = hiddenFields
					? hiddenFields.find(name => name === value)
					: false
				const colType = colAttribute
					? colAttribute.find(name => name === prefix)
					: true
				if (colType && !hidden) {
					acc.push(col)
				}
				return acc
			}, [] as string[])
		}
		return []
	}, [collection, hiddenFields, colAttribute])
}
