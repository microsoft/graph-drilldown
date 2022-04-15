/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { PositionMap } from '@graspologic/graph'
import { not, table } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback, useMemo } from 'react'

import {
	useBigTable,
	useCommunitiesTable,
	useCommunityNodesTable,
	useEdgeTable,
	useGroupedByCommunityTable,
	useGroupedByParentTable,
	useHoveredCommunity,
	useResetBigTable,
	useResetEdgeTable,
	useResetNavigationState,
	useResetSelectedCommunity,
	useSelectedCommunity,
	useSetBigTable,
	useSetEdgeTable,
	useUniqueNodes,
} from '~/state'
import { useCachedColumnHistogram, useCachedColumnStats } from '~/state/caches'

import { ROOT_COMMUNITY_ID } from '../constants'
import type { ColumnDef, Community, Edge, ItemType } from '../types'
import { findNodesCollectionForCommunity } from './communities'
import { filterEdgesToNodes } from './edges'
import { deriveLayoutPositions, deriveSmallMultiplePositions } from './layout'
import {
	initializeEdgeTable,
	initializeNodeTable,
	joinDataTables,
	joinNodeCommunityTables,
	listColumnDefs,
} from './table'
import type { TableCollection } from './TableCollection'
import {
	CommunityCollection,
	EdgeCollection,
	NodeCollection,
} from './TableCollection'

export function useArqueroBigTable() {
	return useBigTable()
}
export function useSetArqueroBigTable() {
	return useSetBigTable()
}

export function useArqueroEdgeTable() {
	return useEdgeTable()
}

export function useSetArqueroEdgeTable() {
	return useSetEdgeTable()
}

export function useClearAllTables() {
	const resetBigTable = useResetBigTable()
	const resetEdgeTable = useResetEdgeTable()
	const resetNav = useResetNavigationState()
	const resetSelectedCommunity = useResetSelectedCommunity()
	return useCallback(() => {
		resetBigTable()
		resetEdgeTable()
		resetNav()
		resetSelectedCommunity()
	}, [resetBigTable, resetEdgeTable, resetNav, resetSelectedCommunity])
}

export function useArqueroAddTable() {
	const bigTable = useArqueroBigTable()
	const setBigTable = useSetArqueroBigTable()
	const setEdgeTable = useSetArqueroEdgeTable()
	return useCallback(
		(newTable: ColumnTable, type: string) => {
			console.log('adding table/columns', type)
			newTable.print()
			let updated = bigTable
			if (type === 'edge') {
				if (bigTable.numRows() === 0) {
					updated = initializeNodeTable(newTable, true)
				}
				const edges = initializeEdgeTable(newTable)
				setEdgeTable(edges)
			} else {
				if (bigTable.numCols() > 0) {
					if (type === 'join') {
						updated = joinNodeCommunityTables(bigTable, newTable)
					} else {
						updated = joinDataTables(bigTable, newTable, type)
					}
				} else {
					// it's a fresh start
					updated = initializeNodeTable(newTable)
				}
			}
			updated.print()
			setBigTable(updated)
		},
		[bigTable, setBigTable, setEdgeTable],
	)
}

export function useArqueroRemoveColumns() {
	const bigTable = useArqueroBigTable()
	const setBigTable = useSetArqueroBigTable()
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

export function useArqueroColumnList(): ColumnDef[] {
	const bigTable = useArqueroBigTable()
	return useMemo(() => listColumnDefs(bigTable, fixed), [bigTable])
}

// for the list of unique nodes, just get the list where parent comm is -1
// this will be the child nodes of every community at the root
export function useArqueroUniqueNodes() {
	return useUniqueNodes()
}

export function useNodeCount() {
	const nodes = useArqueroUniqueNodes()
	return nodes.size
}

export function useEdgeCount() {
	const edges = useEdgeTable()
	return edges.numRows()
}

export function useColumnStats(table: ColumnTable, field?: string) {
	return useCachedColumnStats(table, field)
}

export function useColumnHistogram(table: ColumnTable, field?: string) {
	return useCachedColumnHistogram(table, field)
}

// TODO: (a) do we actually need to filter edges to ensure node alignment?
// (b) we should create a useVisibleEdges list that matches the selected community, just like nodes
export function useArqueroUniqueEdges() {
	const table = useEdgeTable()
	const nodes = useArqueroUniqueNodes()
	return useMemo(() => {
		const filtered = filterEdgesToNodes(table, nodes)
		return new EdgeCollection(filtered)
	}, [table, nodes])
}

// visible communities are always derived from the selected parent
export function useArqueroVisibleCommunities() {
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

// NOTE: do we really need to enforce excluding these fields from the vis config?
// eventually we could have a much more general purpose mapping, which allows
// the user to assign ANY field to ANY encoding property (position, color, size, shape...)
const exclude = new Set([
	'node.id',
	'node.x',
	'node.y',
	'community.pid',
	'community.level',
])

export function useArqueroDataFields(): string[] {
	const bigTable = useArqueroBigTable()
	return useMemo(
		() => bigTable.columnNames((d: string) => !exclude.has(d)),
		[bigTable],
	)
}

// we would prefer the visible nodes to be derived using the parent community
// this ensures that each node has the properties of the child community it resides in
// however, if we select a leaf community with no children, there will be no child entries
// when filtering by parent - in this case, just return the nodes for that community
export function useArqueroVisibleNodes() {
	const table = useArqueroVisibleNodesTable()
	return useMemo(() => new NodeCollection(table), [table])
}

export function useArqueroVisibleNodesTable() {
	const pid = useSelectedCommunity()
	return useCommunityNodesTable(pid)
}

// TODO: actually filter this
export function useArqueroVisibleEdges(id?: string) {
	const edges = useArqueroEdgeTable()
	return useMemo(() => new EdgeCollection(edges), [edges])
}

export function useArqueroHoveredNodes() {
	const hovered = useHoveredCommunity()
	const byParent = useGroupedByParentTable()
	const byCommunity = useGroupedByCommunityTable()
	return useMemo(
		() => findNodesCollectionForCommunity(hovered, byParent, byCommunity),
		[hovered, byParent, byCommunity],
	)
}

export function useArqueroSelectedNodes() {
	const selected = useSelectedCommunity()
	const nodes = useArqueroVisibleNodes()
	return useMemo(
		() => (selected === ROOT_COMMUNITY_ID ? new NodeCollection() : nodes),
		[selected, nodes],
	)
}

export function useTableColumnsByType(dataType: string) {
	// const byCommunity = useGroupedByCommunityTable()
	const bigTable = useArqueroBigTable()

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
	const nodes = useArqueroVisibleNodes()
	return useMemo(() => deriveLayoutPositions(nodes.table), [nodes])
}

export function useGriddedNodePositions(compute?: boolean) {
	const nodes = useArqueroVisibleNodesTable()
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
	table: TableCollection<Node | Community | Edge>,
	colAttribute: ItemType[] | undefined,
	hiddenFields: string[] | undefined,
): string[] {
	return useMemo(() => {
		const allColumns = table.table.columnNames()
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
	}, [table, hiddenFields, colAttribute])
}
