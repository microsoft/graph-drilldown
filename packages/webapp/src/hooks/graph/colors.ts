/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { toGraphColor } from '@graspologic/graph'
import type { ColorVector, GraphColor } from '@graspologic/renderer'
import { Color } from '@thematic/color'
import { SelectionState } from '@thematic/core'
import { useThematic } from '@thematic/react'
import { useCallback, useMemo } from 'react'

import type { ColorEncoding } from '../../types'
import type { TableBackedItem } from '@graph-drilldown/types'
import { useThematicColorScale } from './scales'

export function useBackgroundColor(alpha = 1.0): ColorVector {
	const theme = useThematic()
	return useMemo(() => theme.plotArea().fill().rgbav(alpha), [theme, alpha])
}

// sometimes we need an explicitly hidden color on the graph, so alpha == 0
export function useHiddenColor(): number {
	return useMemo(() => 0, [])
}

export function useHoveredNodeColor(): ColorVector {
	const theme = useThematic()
	return useMemo(() => theme.application().error().rgbav(), [theme])
}

export function useSelectedNodeColor(): ColorVector {
	const theme = useThematic()
	return useMemo(() => theme.node().fill().rgbav(), [theme])
}

export function useSuppresedNodeColor(): GraphColor {
	const theme = useThematic()
	return useMemo(
		() =>
			toGraphColor(
				theme.node({ selectionState: SelectionState.NoData }).fill().rgbav(),
			),
		[theme],
	)
}

export function useMiniMapNodeColor(): number {
	return useSuppresedNodeColor()
}

export function useAOIBoundsColor(): string {
	const theme = useThematic()
	return useMemo(() => theme.rule().stroke().hex(), [theme])
}

const COLOR_NONE = new Color('none')

export function useDataBoundColorScale(
	encoding: ColorEncoding,
): (item: TableBackedItem) => Color {
	const colorScale = useThematicColorScale(encoding)
	// eslint-disable-next-line
	const colorCache = useMemo(() => new Map<any, Color>(), [encoding])
	return useCallback(
		(item: TableBackedItem): Color => {
			if (!item || !encoding.field) {
				return COLOR_NONE
			}
			const value = item.get(encoding.field)
			let color = colorCache.get(value)
			if (color == null) {
				color = colorScale(value)
				colorCache.set(value, color)
			}
			return color
		},
		[encoding, colorScale, colorCache],
	)
}
