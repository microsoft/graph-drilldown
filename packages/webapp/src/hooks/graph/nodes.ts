/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { NodeCollection } from '@graph-drilldown/arquero'
import type {
	NodeColorizer,
	NodeWeighter,
	PositionMap,
} from '@graspologic/graph'
import { useMemo } from 'react'

import { deriveLayoutPositions, deriveSmallMultiplePositions } from '~/layout'
import {
	useCommunityNodesTable,
	useNodeColorEncoding,
	useNodeSizeEncoding,
	useSelectedCommunity,
	useUniqueNodes,
} from '~/state'
import { useVisibleNodeMap } from '~/state/caches'
import { useNodeOpacityEncoding } from '~/state/vis/nodeOpacity'

import { useColorizer, useRange, useWeighter } from './graspologic'

export function useNodeCount() {
	const nodes = useUniqueNodes()
	return nodes.size
}

export function useNodeIds(nodes?: NodeCollection) {
	return useMemo(() => (nodes ? nodes.map((node) => node.id) : []), [nodes])
}

export function useNodeColumns(nodes?: NodeCollection) {
	const ids = useMemo(() => {
		if (nodes) {
			return nodes.map((node) => {
				const attrs = { x: node.x, y: node.y, d: node.d }
				return { id: node.id, attrs }
			})
		}
		return []
	}, [nodes])
	return ids
}

export function useNodeWeighter(): NodeWeighter {
	const encoding = useNodeSizeEncoding()
	const cid = useSelectedCommunity()
	const map = useVisibleNodeMap(cid)
	return useWeighter(encoding, map) as NodeWeighter
}

export function useNodeColorScale() {
	const colorEncoding = useNodeColorEncoding()
	const opacityEncoding = useNodeOpacityEncoding()
	const cid = useSelectedCommunity()
	const map = useVisibleNodeMap(cid)
	return useColorizer(colorEncoding, opacityEncoding, map) as NodeColorizer
}

/**
 * Radii are bound to a min/max width rather than
 * completely scale-driven like color.
 * This toggles between the fixed min/max and scaled.
 */
export function useNodeSizeRange(): [number, number] {
	const encoding = useNodeSizeEncoding()
	return useRange(encoding)
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

export function useVisibleNodesTable() {
	const pid = useSelectedCommunity()
	return useCommunityNodesTable(pid)
}
