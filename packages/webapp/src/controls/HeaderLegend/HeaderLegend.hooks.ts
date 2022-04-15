/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { getNamedSchemeColor, isNominal } from '@thematic/color'
import { useThematic } from '@thematic/react'
import { useCallback, useMemo } from 'react'

import {
	useNumericEncodingScale,
	useThematicColorScale,
} from '../../hooks/graph'
import type { ColorEncoding, NumericEncoding } from '../../types'
import { DataBinding } from '../../types'

export function useIsNominal(encoding: ColorEncoding) {
	return useMemo(() => isNominal(encoding.scaleName), [encoding])
}

export function useLegendNumericScale(
	encoding?: NumericEncoding,
	count = 10,
	/**
	 * Value to use if no encoding is provided.
	 */
	defaultValue = 0,
) {
	const enc = useMemo(() => {
		return (
			encoding ||
			({
				binding: DataBinding.Fixed,
				value: defaultValue,
			} as NumericEncoding)
		)
	}, [encoding, defaultValue])

	const scale = useSizeScale(enc, count)

	return useCallback(
		(value?: number) => {
			if (enc.binding === DataBinding.Fixed) {
				return enc.value
			}
			return scale(value || 0)
		},
		[enc, scale],
	)
}

function useSizeScale(encoding, count) {
	const scale = useNumericEncodingScale(encoding)
	return useCallback(
		index => {
			const [min, max] = encoding.domain
			const steps = (max - min) / count
			const v = steps * index + min
			return scale(v)
		},
		[encoding, scale, count],
	)
}

/**
 * Provides an indexed color scale that maps the encoding colors
 * to the item position. Dynamically returns the correct color based
 * on encoding type.
 * If there is no encoding, it returns the default legend fill color.
 * @param encoding
 * @param count
 */
export function useLegendColorScale(
	encoding?: ColorEncoding,
	count = 10,
	/**
	 * Default hex color to use if no encoding is provided.
	 */
	defaultValue = 'none',
) {
	const enc = useMemo(() => {
		return (
			encoding ||
			({
				binding: DataBinding.Fixed,
				value: defaultValue,
			} as ColorEncoding)
		)
	}, [encoding, defaultValue])

	const fixedColor = useFixedColor(enc)
	const paletteColor = usePaletteColor(enc)
	const sampledColors = useSampledColors(enc, count)

	return useCallback(
		(index?: number) => {
			switch (enc.binding) {
				case DataBinding.Fixed:
					return fixedColor
				case DataBinding.Palette:
					return paletteColor
				case DataBinding.Scaled:
					return sampledColors[index || 0]
			}
		},
		[enc, fixedColor, paletteColor, sampledColors],
	)
}

export function useSampledColors(encoding: ColorEncoding, count = 10) {
	const scale = useThematicColorScale(encoding)
	return useMemo(() => {
		const allColors = scale.toArray()
		// HACK: there is a bug in the thematic toArray for continuous scales
		// it does not cover the whole range correctly
		// this checks for a length that matches the hard-coded continuous output
		// for thematic, and re-scales to ensure it captures the endpoints
		if (allColors.length === 100) {
			const [min, max] = encoding.domain || [0, 1]
			const steps = (max - min) / count
			const colors = new Array(count).fill(1).map((a, i) => {
				const v = steps * i + min
				return scale(v).hex()
			})
			return colors
		}
		return scale.toArray(count)
	}, [scale, encoding, count])
}

export function useFixedColor(encoding: ColorEncoding) {
	return useMemo(() => encoding.value, [encoding])
}

export function usePaletteColor(encoding: ColorEncoding) {
	const theme = useThematic()
	return useMemo(
		() => getNamedSchemeColor(theme.scheme, encoding.thematicSchemePath).hex(),
		[theme, encoding],
	)
}
