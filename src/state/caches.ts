/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/**
 * This is a set of cached expensive computes that need to persist across component unmounts.
 */
import { ColumnStats, Node } from '../types'
import { uniqueNodesState } from './nodes'
import { settingsState } from './settings'
import { communityNodesTableState, edgeTableState } from './tables'
import { edgesVisibleState } from './vis'
import { GraphContainer } from '@graspologic/graph'
import { table } from 'arquero'
import { useEffect } from 'react'
import {
	atom,
	atomFamily,
	selector,
	selectorFamily,
	useRecoilState,
	useRecoilValue,
} from 'recoil'
import {
	EdgeCollection,
	getColumnHistogram,
	getColumnStats,
	NodeCollection,
} from '~/arquero'

// this is a map of color strings to bgra values,
// the color parsing is very expensive.
// note the mutability - we want this to be updated
// during a single render loop
// this cache can persist for the life of the app, as any
// color string only has one bgra value
const colorCacheState = atom<Map<string, number>>({
	key: 'color-cache',
	default: new Map<string, number>(),
	dangerouslyAllowMutability: true,
})

export function useColorCache() {
	return useRecoilValue(colorCacheState)
}

const internedGraphState = selector<GraphContainer>({
	key: 'interned-graph-cache',
	get: ({ get }) => {
		console.time('intern graph')
		const settings = get(settingsState)
		const { maxEdges, subsampleEdges, maxNodes, subsampleNodes } = settings
		const showEdges = get(edgesVisibleState)
		const nodes = get(uniqueNodesState)
		const edgeTable = get(edgeTableState)
		const nProportion = sampleProportion(nodes.size, maxNodes, subsampleNodes)
		const edges = new EdgeCollection(edgeTable)
		const eProportion = sampleProportion(edges.size, maxEdges, subsampleEdges)
		const container = GraphContainer.intern({
			nodes: nodes.sample(nProportion),
			edges: showEdges ? edges.sample(eProportion) : [],
		})
		console.timeEnd('intern graph')
		return container
	},
	dangerouslyAllowMutability: true,
})

function sampleProportion(
	numRows: number,
	maxRows: number,
	subsample: boolean,
) {
	if (subsample && numRows > maxRows) {
		return maxRows / numRows
	}
	return 1
}

export function useInternedGraph(): GraphContainer {
	return useRecoilValue(internedGraphState)
}

const internedMinimapGraphState = selector<GraphContainer>({
	key: 'interned-minimap-cache',
	get: ({ get }) => {
		console.time('intern minimap')
		const settings = get(settingsState)
		const { maxMiniMapNodes, subsampleMiniMap } = settings
		const nodes = get(uniqueNodesState)
		const proportion = sampleProportion(
			nodes.size,
			maxMiniMapNodes,
			subsampleMiniMap,
		)
		const container = GraphContainer.intern({
			nodes: nodes.sample(proportion),
			edges: [],
		})
		console.timeEnd('intern minimap')
		return container
	},
	dangerouslyAllowMutability: true,
})

export function useInternedMinimapGraph(): GraphContainer {
	return useRecoilValue(internedMinimapGraphState)
}

const visibleNodeMapState = selectorFamily<Map<string, Node>, string>({
	key: 'visible-nodes-map',
	get:
		cid =>
		({ get }) => {
			const table = get(communityNodesTableState(cid))
			const nodes = new NodeCollection(table)
			return nodes.toMap()
		},
})

export function useVisibleNodeMap(cid: string) {
	return useRecoilValue(visibleNodeMapState(cid))
}

// generate a unique key for storing cached values related to a table
// warning: this isn't entirely guaranteed to be unique, but should
// cover any expected scenarios we encounter (right?)
function tableKey(table: table) {
	return `${table.columnNames().join('-')}-${table.numRows()}`
}

const cachedColumnStatsState = atomFamily<ColumnStats | undefined, string>({
	key: 'column-stats-cache',
	default: undefined,
})

export function useCachedColumnStats(table: table, field?: string) {
	const key = `${tableKey(table)}-${field}`
	const [cached, setCached] = useRecoilState(cachedColumnStatsState(key))
	useEffect(() => {
		if (!cached) {
			const stats = getColumnStats(table, field)
			setCached(stats)
		}
	}, [cached, setCached, table, field])
	return cached
}

const cachedColumnHistogramState = atomFamily<any[] | undefined, string>({
	key: 'column-histogram-cache',
	default: undefined,
})

export function useCachedColumnHistogram(table: table, field?: string) {
	const key = `${tableKey(table)}-${field}`
	const [cached, setCached] = useRecoilState(cachedColumnHistogramState(key))
	useEffect(() => {
		if (!cached) {
			const histo = getColumnHistogram(table, field)
			setCached(histo)
		}
	}, [cached, setCached, table, field])
	return cached
}
