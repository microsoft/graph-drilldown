/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { rect, svg, text } from '@thematic/d3'
import { useThematic } from '@thematic/react'
import { scaleLinear } from 'd3-scale'
import { select } from 'd3-selection'
import { memo, useLayoutEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import { chooseScale } from '../thematic/chooseScale.js'

export interface LegendAxisProps {
	domain: [number, number]
	brushedDomain?: [number, number]
	/**
	 * Width of the chart in pixels
	 * Note that there is no validation that the number of bars at specified width will fit
	 */
	width: number
	/**
	 * Height of the chart in pixels
	 */
	height: number
	/**
	 * Name of the thematic scale to use.
	 * TODO: this should also map correctly with scaleLog
	 */
	scale?: string
}

export const LegendAxis: React.FC<LegendAxisProps> = memo(function LegendAxis({
	domain,
	brushedDomain,
	width,
	height,
	scale,
}) {
	const xLinear = useMemo(
		() =>
			scaleLinear()
				.domain(domain)
				.range([1, width - 1])
				.clamp(true),
		[domain, width],
	)

	const theme = useThematic()
	const ref = useRef(null)

	const [axisGroup, setAxisGroup] = useState<any>()

	const displayedDomain = useMemo(
		() => brushedDomain || domain,
		[domain, brushedDomain],
	)
	const scaleRange = useMemo(
		() => [
			Math.floor(xLinear(displayedDomain[0]) || 0),
			Math.floor(xLinear(displayedDomain[1]) || 1),
		],
		[displayedDomain, xLinear],
	)

	useLayoutEffect(() => {
		// TODO: stage this so it doesn't reset, but rather updates
		select(ref.current).selectAll('svg').remove()
		const plot = select(ref.current)
			.append('svg')
			.attr('class', 'legend-axis-chart')
			.attr('width', width)
			.attr('height', height)
			.call(svg as any, theme.chart())
			.append('g')
			.attr('class', 'legend-axis-plotarea')
		plot
			.append('rect')
			.attr('width', width)
			.attr('height', height)
			.call(rect as any, theme.plotArea())
		const ag = plot.append('g').attr('class', 'legend-axis-group')
		setAxisGroup(ag)
	}, [theme, width, height])

	useLayoutEffect(() => {
		if (axisGroup && scale) {
			axisGroup.selectAll('line').remove()
			const scaleWidth = scaleRange[1] - scaleRange[0]
			const scaleInstance = chooseScale(theme, scale, scaleWidth)
			// TODO: this could probably be fixed to 100 values and scaled
			// with a scaleLinear + computed line width
			const data = new Array(scaleWidth).fill(1).map((a, i) => i)
			axisGroup
				.selectAll('line')
				.data(data)
				.enter()
				.append('line')
				.attr('stroke', (d: any) => scaleInstance(d).hex())
				.attr('stroke-width', 2)
				.attr('x1', (d: any) => d + scaleRange[0])
				.attr('x2', (d: any) => d + scaleRange[0])
				.attr('y1', 0)
				.attr('y2', height)
		}
	}, [theme, axisGroup, scale, scaleRange, height])

	useLayoutEffect(() => {
		if (axisGroup) {
			axisGroup.selectAll('text').remove()
			axisGroup
				.append('text')
				.text(displayedDomain[0])
				.call(text as any, theme.text())
				.attr('dominant-baseline', 'middle')
				.attr('x', scaleRange[0] + 1)
				.attr('y', height / 2 + 1)
				.attr('font-size', height - 2)
			axisGroup
				.append('text')
				.text(displayedDomain[1])
				.call(text as any, theme.text())
				.attr('dominant-baseline', 'middle')
				.attr('text-anchor', 'end')
				.attr('x', scaleRange[1] - 1)
				.attr('y', height / 2 + 1)
				.attr('font-size', height - 2)
		}
	}, [theme, axisGroup, scaleRange, displayedDomain, height])

	return <Container ref={ref} width={width} height={height} />
})

const Container = styled.div<{ width: number; height: number }>`
	width: ${({ width }) => width}px;
	height: ${({ height }) => height}px;
`
