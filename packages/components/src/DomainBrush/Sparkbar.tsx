/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SelectionState } from '@thematic/core'
import { line, rect, svg } from '@thematic/d3'
import { useThematic } from '@thematic/react'
import { brushX } from 'd3-brush'
import { scaleLinear } from 'd3-scale'
import { select } from 'd3-selection'
import {
	memo,
	useCallback,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import styled from 'styled-components'

export interface SparkbarProps {
	/**
	 * Array of data to plot as bars
	 */
	data: unknown[]

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
	 * Width of each bar on the chart
	 */
	barWidth?: number
	/**
	 * Gap between bars on the chart
	 */
	barGap?: number
	/**
	 * Accessor for the x-bound dimension of the datum
	 */
	x: (d: unknown, i: number) => number
	/**
	 * Accessor for the y-bound dimension of the datum (i.e., bar height)
	 */
	y: (d: unknown, i: number) => number
	/**
	 * Accessor function that accepts a datum and returns whether it is a no data placeholder
	 */
	nodata?: (d: unknown) => boolean
	/**
	 * Selected datum to highlight on the chart
	 */
	selected?: (d: unknown) => boolean
	/**
	 * Click handler for datum bars
	 */
	onClick?: (d: unknown) => void
	/**
	 * Special indicator for a data point to highlight above and beyond normal selection.
	 */
	marked?: (d: unknown) => boolean

	onBrushEnd?: (domain: [number, number] | null) => void
}

export const Sparkbar: React.FC<SparkbarProps> = memo(function Sparkbar({
	data,
	domain,
	brushedDomain,
	width,
	height,
	barWidth = 8,
	barGap = 1,
	nodata,
	selected,
	onClick,
	x,
	y,
	marked,
	onBrushEnd,
}) {
	const xLinear = useMemo(
		() =>
			scaleLinear()
				.domain(domain)
				.range([barWidth / 2, width - barWidth / 2])
				.clamp(true),
		[domain, width, barWidth],
	)

	const xScale = useMemo(
		() => (d: any, i: number) => xLinear(x(d, i)),
		[x, xLinear],
	)

	const hScale = useMemo(() => {
		const ext = getExtent(data, y)
		const h = scaleLinear().domain(ext).range([0, height])
		return (d: any, i: number) => h(d.length)
	}, [data, y, height])

	const theme = useThematic()
	const ref = useRef(null)
	const handleClick = useCallback(d => onClick && onClick(d), [onClick])
	const nodataFn = useCallback(
		(d: unknown) => {
			if (nodata) {
				return nodata(d)
			}
			return false
		},
		[nodata],
	)
	const [hovered, setHovered] = useState<any>(null)
	const handleHover = useCallback(d => setHovered(d), [])
	const [barGroup, setBarGroup] = useState<any>()
	const [brushSelection, setBrushSelection] = useState<any>()

	const handleBrushEnd = useCallback(
		event => {
			if (onBrushEnd) {
				if (event?.sourceEvent) {
					const { selection } = event
					const newdomain: [number, number] = [
						xLinear.invert(selection[0]),
						xLinear.invert(selection[1]),
					]
					onBrushEnd(newdomain)
				}
			}
		},
		[onBrushEnd, xLinear],
	)
	const brush = useMemo(
		() => brushX().on('end', handleBrushEnd),
		[handleBrushEnd],
	)

	useLayoutEffect(() => {
		// TODO: stage this so it doesn't reset, but rather updates
		select(ref.current).selectAll('svg').remove()
		const plot = select(ref.current)
			.append('svg')
			.attr('class', 'sparkbar-chart')
			.attr('width', width)
			.attr('height', height)
			.call(svg as any, theme.chart())
			.append('g')
			.attr('class', 'sparkbar-plotarea')
		plot
			.append('rect')
			.attr('width', width)
			.attr('height', height)
			.call(rect as any, theme.plotArea())
		const bg = plot.append('g').attr('class', 'sparkbar-bars')
		setBarGroup(bg)
		// only actually append the brush interaction if there is an event to handle it
		if (onBrushEnd) {
			const b = plot.append('g').attr('class', 'brush').call(brush)
			b.select('.selection').attr('stroke', 'none')
			setBrushSelection(b)
		}
	}, [theme, data, width, height, brush, onBrushEnd])

	useLayoutEffect(() => {
		if (data.length > 0) {
			const yScale = (d: any, i: number) => height - (hScale(d, i) || 0)
			if (barGroup) {
				barGroup.selectAll('*').remove()
				barGroup
					.selectAll('.bar')
					.data(data)
					.enter()
					.append('line')
					.attr('class', 'bar')
					.attr('x1', xScale)
					.attr('x2', xScale)
					.attr('y1', yScale)
					.attr('y2', height)
					.call(line as any, theme.line())
					.attr('stroke-width', barWidth)
			}
		}
	}, [
		theme,
		data,
		barGroup,
		width,
		height,
		barWidth,
		barGap,
		nodataFn,
		xScale,
		hScale,
	])

	useLayoutEffect(() => {
		if (barGroup) {
			barGroup
				.selectAll('.bar')
				.on('mouseover', (d: any) => handleHover(d))
				.on('mouseout', () => handleHover(null))
				.on('click', handleClick)
		}
	}, [data, barGroup, handleClick, handleHover])

	useLayoutEffect(() => {
		const cursor = onClick ? 'pointer' : 'default'
		if (barGroup) {
			barGroup.selectAll('.bar').style('cursor', cursor)
		}
	}, [data, barGroup, onClick])

	// generate a complimentary highlight
	const highlight = useMemo(() => theme.scales().nominal(10)(1).hex(), [theme])

	useLayoutEffect(() => {
		const getSelectionState = (d: any) => {
			if (nodataFn(d)) {
				return SelectionState.NoData
			}
			if (d === hovered) {
				return SelectionState.Hovered
			}
			const sel = selected ? selected(d) : false
			if (sel) {
				return SelectionState.Selected
			}
			return SelectionState.Normal
		}
		if (barGroup) {
			barGroup.selectAll('.bar').attr('stroke', (d: any) => {
				const selectionState = getSelectionState(d)
				const mark = marked ? marked(d) : false
				return mark
					? highlight
					: theme
							.line({
								selectionState,
							})
							.stroke()
							.hex()
			})
		}
	}, [theme, data, barGroup, highlight, nodataFn, hovered, selected, marked])

	useLayoutEffect(() => {
		if (brushedDomain && brushSelection && brush) {
			if (brushedDomain[0] === domain[0] && brushedDomain[1] === domain[1]) {
				// Clear out brush when date range is maxed out.
				brush.move(brushSelection, null)
			} else {
				const [start, end] = brushedDomain
				brush.move(brushSelection, [xLinear(start) || 0, xLinear(end) || 1])
			}
		}
	}, [brushedDomain, domain, xLinear, brush, brushSelection])

	return <Container ref={ref} width={width} height={height} />
})

function getExtent(
	data: any[],
	accessor: (d: unknown, i: number) => number,
): [number, number] {
	return data.reduce(
		(acc: any, cur, idx) => {
			return [
				Math.min(accessor(cur, idx), acc[0]),
				Math.max(accessor(cur, idx), acc[1]),
			]
		},
		[Number.MAX_VALUE, Number.MIN_VALUE] as [number, number],
	)
}

const Container = styled.div<{ width: number; height: number }>`
	width: ${({ width }) => width}px;
	height: ${({ height }) => height}px;
`
