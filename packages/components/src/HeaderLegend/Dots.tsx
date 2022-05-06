/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ColorEncoding, NumericEncoding } from '@graph-drilldown/types'
import { useThematic } from '@thematic/react'
import { scaleLinear } from 'd3-scale'
import { useMemo } from 'react'

import {
	useLegendColorScale,
	useLegendNumericScale,
} from './HeaderLegend.hooks.js'

export interface DotsProps {
	colorEncoding?: ColorEncoding
	sizeEncoding?: NumericEncoding
	opacityEncoding?: NumericEncoding
	width?: number
	height?: number
	maxItems?: number
}

export const Dots: React.FC<DotsProps> = ({
	colorEncoding,
	sizeEncoding,
	opacityEncoding,
	width = 200,
	height = 10,
	maxItems = 10,
}) => {
	const theme = useThematic()
	const colorScale = useLegendColorScale(
		colorEncoding,
		maxItems,
		theme.application().highContrast().hex(),
	)
	const sizeScale = useLegendNumericScale(
		sizeEncoding,
		maxItems,
		height / 2 - 1,
	)
	const opacityScale = useLegendNumericScale(opacityEncoding, maxItems, 0.9)

	const dots = useMemo(() => {
		const mid = height / 2 - 1
		const x = scaleLinear()
			.domain([0, maxItems - 1])
			.range([mid, width - mid])
		return new Array(maxItems).fill(1).map((_, i) => {
			const fill = colorScale(i)
			const r = sizeScale(i)
			const opacity = opacityScale(i)
			return (
				<circle
					key={`dots-${fill}-${r}-${opacity}-${i}`}
					fill={fill}
					fillOpacity={opacity}
					// tiny background border in case of overlap
					stroke={theme.plotArea().fill().hex()}
					strokeWidth={0.5}
					cx={x(i)}
					cy={mid}
					r={r}
				/>
			)
		})
	}, [theme, width, height, maxItems, colorScale, sizeScale, opacityScale])
	if (height <= 1) {
		return null
	}
	return (
		<svg width={width} height={height}>
			<g>{dots}</g>
		</svg>
	)
}
