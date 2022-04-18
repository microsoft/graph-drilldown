/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/**
 * This scales in this module map visual encodings to raw underlying scales.
 * I.e., the inputs to these scales are base primitives.
 */
import { useThematicColorScale } from '@graph-drilldown/hooks'
import type { ColorEncoding, NumericEncoding } from '@graph-drilldown/types'
import { DataBinding } from '@graph-drilldown/types'
import { Color, getNamedSchemeColor } from '@thematic/color'
import { ScaleType } from '@thematic/core'
import { useThematic } from '@thematic/react'
import { scaleLinear, scaleLog } from 'd3-scale'
import { useCallback, useMemo } from 'react'

export function useNumericEncodingScale(
	encoding: NumericEncoding,
	overrides?: Partial<NumericEncoding>,
) {
	const enc = useMemo(
		() => ({
			...encoding,
			...overrides,
		}),
		[encoding, overrides],
	)
	const fixed = useCallback(() => enc.value || 1e-6, [enc])
	const scale = useMemo(() => {
		// TODO: check safe log domains (no zero crossings) and adjust
		const fn = enc.scaleType === ScaleType.Log ? scaleLog : scaleLinear
		const domain = enc.domain || [0, 1]
		const range = enc.range || [0, 1]
		return fn().domain(domain).range(range).clamp(true)
	}, [enc])

	const scaled = useCallback(
		(value?: number) => scale(value || 1e-6) as number,
		[scale],
	)

	if (enc.binding === DataBinding.Fixed) {
		return fixed
	}
	return scaled
}

export function useColorEncodingScale(encoding: ColorEncoding) {
	const theme = useThematic()
	const fixed = useCallback(
		() => new Color(encoding.value || 'none'),
		[encoding],
	)
	const palette = useCallback(
		() => getNamedSchemeColor(theme.scheme, encoding.thematicSchemePath),
		[theme, encoding],
	)
	const scaled = useCachedThematicColorScale(encoding)
	switch (encoding.binding) {
		case DataBinding.Fixed:
			return fixed
		case DataBinding.Palette:
			return palette
		default:
			return scaled
	}
}

const COLOR_NONE = new Color('none')

function useCachedThematicColorScale(encoding: ColorEncoding) {
	const colorScale = useThematicColorScale(encoding)
	// eslint-disable-next-line
	const colorCache = useMemo(() => new Map<any, Color>(), [encoding])
	return useCallback(
		(value?: any): Color => {
			if (!value || !encoding.field) {
				return COLOR_NONE
			}
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
