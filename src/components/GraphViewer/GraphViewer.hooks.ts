/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PositionMap } from '@graspologic/graph'
import { useMemo } from 'react'
import { useStandardNodePositions, useGriddedNodePositions } from '~/arquero'
import {
	useEdgeColorizer,
	useEdgeSizeRange,
	useEdgeWeighter,
	useNodeColorScale,
	useNodeSizeRange,
	useNodeWeighter,
} from '~/hooks/graph'
import { useEdgesVisible, useNodesVisible } from '~/state'
import { ViewType } from '~/types'

// creates two sets of positions for the nodes
// 1: their default layout
// 2: a gridded community small multiples layout
export function usePositions(view: ViewType): [PositionMap, PositionMap] {
	const defaultPositionMap = useStandardNodePositions()
	const griddedPositionMap = useGriddedNodePositions(
		view === ViewType.SmallMultiple,
	)
	return useMemo(
		() => [defaultPositionMap, griddedPositionMap],
		[defaultPositionMap, griddedPositionMap],
	)
}

export function useNodeRendering() {
	const showNodes = useNodesVisible()
	const nodeColorizer = useNodeColorScale()
	const nodeWeighter = useNodeWeighter()
	const nodeRange = useNodeSizeRange()
	return {
		showNodes,
		nodeColorizer,
		nodeWeighter,
		nodeRange,
	}
}

export function useEdgeRendering() {
	const showEdges = useEdgesVisible()
	const edgeColorizer = useEdgeColorizer()
	const edgeWeighter = useEdgeWeighter()
	const edgeRange = useEdgeSizeRange()
	return {
		showEdges,
		edgeColorizer,
		edgeWeighter,
		edgeRange,
	}
}
