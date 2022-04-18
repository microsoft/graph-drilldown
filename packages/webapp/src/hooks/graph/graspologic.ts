/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableBackedItem } from '@graph-drilldown/types'
import type {
	EdgeColorizer,
	EdgeWeighter,
	NodeColorizer,
	NodeWeighter,
} from '@graspologic/graph'
import { toGraphColor } from '@graspologic/graph'
import type { GraphColor, Id, Maybe } from '@graspologic/renderer'
import { useCallback, useMemo } from 'react'

import { useColorCache } from '~/state/caches'

import type { ColorEncoding, NumericEncoding } from '../../types'
import { DataBinding } from '../../types'
import { useColorEncodingScale, useNumericEncodingScale } from './scales'

// TODO: use the node/edge sizer instead of weighter,
// so it can be bound directly to the encoding range
// as it is we need to set min/max radius/size on the GraphView
const OVERRIDES: Partial<NumericEncoding> = {
	range: [0, 1],
}

/**
 * This provides a callback conforming to the Weighter interfaces
 * for node/edge sizes.
 * @param encoding
 * @param map
 */
export function useWeighter(
	encoding: NumericEncoding,
	map: Map<string, TableBackedItem>,
): NodeWeighter | EdgeWeighter {
	const scale = useNumericEncodingScale(encoding, OVERRIDES)
	return useCallback(
		(id: Maybe<Id>) => {
			if (!encoding.field) {
				return scale()
			}
			const node = map.get(id as string)
			if (node) {
				const value = node.get(encoding.field)
				return scale(value) as number
			}
			return 0
		},
		[scale, encoding, map],
	)
}

/**
 * This provides a callback conforming to the Colorizer interfaces
 * for node/edge colors. Note that it unifies color + opacity so
 * they can be configured separately and each scaled to table properties.
 * (The graspologic interface does not have a separate scaled opacity prop)
 * @param colorEncoding
 * @param opacityEncoding
 * @param map
 */
export function useColorizer(
	colorEncoding: ColorEncoding,
	opacityEncoding: NumericEncoding,
	map: Map<string, TableBackedItem>,
): NodeColorizer | EdgeColorizer {
	const colorScale = useColorEncodingScale(colorEncoding)
	const opacityScale = useNumericEncodingScale(opacityEncoding)
	const colorCache = useColorCache()
	return useCallback(
		(id: Maybe<Id>): GraphColor => {
			const item = map.get(id as string)
			let color
			let opacity
			if (item && colorEncoding.field) {
				const colorData = item.get(colorEncoding.field)
				color = colorScale(colorData)
			} else {
				color = colorScale()
			}
			if (item && opacityEncoding.field) {
				const opacityData = item.get(opacityEncoding.field)
				opacity = opacityScale(opacityData)
			} else {
				opacity = opacityScale()
			}
			const key = `${color.raw}-${opacity}`
			let cached = colorCache.get(key)
			if (!cached) {
				cached = toGraphColor(color.rgbav(opacity))
				colorCache.set(key, cached)
			}
			return cached
		},
		[colorScale, opacityScale, colorEncoding, opacityEncoding, map, colorCache],
	)
}

/**
 * Some graspologic apis have a weighter that scales 0-1,
 * accompanied by min/max props on the component.
 * This provides a toggled range to ensure valid min/max
 * values switch for fixed versus scaled ranges.
 * @param encoding
 */
export function useRange(encoding: NumericEncoding): [number, number] {
	return useMemo(() => {
		if (encoding.binding === DataBinding.Fixed) {
			return encoding.value ? [encoding.value, encoding.value] : [0, 0]
		}
		return encoding.range || [0, 1]
	}, [encoding])
}
