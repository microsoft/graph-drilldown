/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ViewType } from '../../types'
import { useColorizer, useRange, useWeighter } from './graspologic'
import {
	NodeColorizer,
	NodePositioner,
	NodeWeighter,
	PositionMap,
} from '@graspologic/graph'
import { useMemo } from 'react'
import { NodeCollection } from '~/arquero'
import {
	useNodeColorEncoding,
	useNodeSizeEncoding,
	useSelectedCommunity,
} from '~/state'
import { useVisibleNodeMap } from '~/state/caches'
import { useNodeOpacityEncoding } from '~/state/vis/nodeOpacity'

export function useNodeIds(nodes?: NodeCollection) {
	return useMemo(() => (nodes ? nodes.map(node => node.id) : []), [nodes])
}

export function useNodeColumns(nodes?: NodeCollection) {
	const ids = useMemo(() => {
		if (nodes) {
			return nodes.map(node => {
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

export function useNodePositions(
	positionMaps: PositionMap[],
	view: ViewType,
	duration?: number,
): NodePositioner {
	return useMemo(() => {
		const positions =
			view === ViewType.SingleGraph ? positionMaps[0] : positionMaps[1]
		return {
			duration,
			x: id => positions[id!]?.x || 0,
			y: id => positions[id!]?.y || 0,
		}
	}, [positionMaps, view, duration])
}
