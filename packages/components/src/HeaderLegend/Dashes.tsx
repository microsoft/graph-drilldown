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

export interface DashesProps {
	colorEncoding?: ColorEncoding
	sizeEncoding?: NumericEncoding
	opacityEncoding?: NumericEncoding
	width?: number
	height?: number
	maxItems?: number
	/**
	 * Margin around each dash
	 */
	margin?: number
}

export const Dashes: React.FC<DashesProps> = ({
	colorEncoding,
	sizeEncoding,
	opacityEncoding,
	width = 200,
	height = 10,
	maxItems = 10,
	margin = 4,
}) => {
	const theme = useThematic()
	const colorScale = useLegendColorScale(
		colorEncoding,
		maxItems,
		theme.application().highContrast().hex(),
	)
	const sizeScale = useLegendNumericScale(sizeEncoding, maxItems, 4)
	const opacityScale = useLegendNumericScale(opacityEncoding, maxItems, 0.9)

	const dashes = useMemo(() => {
		// inner width availble to the dashes
		const inner = width - margin * 2
		// allowable dash size given width/margins
		const dw = (inner - maxItems * margin) / maxItems
		const half = dw / 2
		// this scale should return the midpoint of each dash
		// note the =/- half in the actual x1/x2 props
		const x = scaleLinear()
			.domain([0, maxItems - 1])
			.range([margin + half, width - margin - half])
		return new Array(maxItems).fill(1).map((_, i) => {
			const color = colorScale(i)
			const size = sizeScale(i)
			const opacity = opacityScale(i)
			return (
				<line
					key={`dashes-${color}-${size}-${opacity}-${i}`}
					x1={(x(i) as number) - half}
					x2={(x(i) as number) + half}
					y1={height / 2}
					y2={height / 2}
					stroke={colorScale(i)}
					strokeWidth={size}
					strokeOpacity={opacity}
				/>
			)
		})
	}, [height, width, margin, maxItems, colorScale, sizeScale, opacityScale])

	if (height <= 1) {
		return null
	}
	return (
		<svg width={width} height={height}>
			<g>{dashes}</g>
		</svg>
	)
}
