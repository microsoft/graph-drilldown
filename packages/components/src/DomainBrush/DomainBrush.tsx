/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useDimensions } from '@essex/hooks'
import { Label, TextField } from '@fluentui/react'
import { format } from 'd3-format'
import { useCallback, useMemo, useRef } from 'react'
import styled from 'styled-components'

import { LegendAxis } from './LegendAxis.js'
import { Sparkbar } from './Sparkbar.js'

export interface DomainBrushProps {
	min?: number
	max?: number
	currentDomain?: [number, number]
	precision?: number
	onChange?: (domain: [number, number]) => void
	histogram?: any[]
	/**
	 * Indicates whether manual input text fields should be included,
	 * or just the brush if false
	 */
	showTextInputs?: boolean
}

const CHART_HEIGHT = 30
const AXIS_HEIGHT = 16
const EMPTY = []

const TEXT_STYLES = {
	field: {
		textAlign: 'center',
	},
}
export const DomainBrush: React.FC<DomainBrushProps> = ({
	min = 0,
	max = 1,
	currentDomain,
	precision = 2,
	onChange,
	histogram = EMPTY,
	showTextInputs,
}) => {
	const ref = useRef(null)

	const dimensions = useDimensions(ref)
	const width = useMemo(() => dimensions?.width || 200, [dimensions])

	const domain = useMemo(
		(): [number, number] => currentDomain || [min, max],
		[currentDomain, min, max],
	)
	const handleMinChange = useCallback(
		(_, v: string | undefined) => {
			onChange && onChange([v ? Number.parseFloat(v) : domain[0], domain[1]])
		},
		[onChange, domain],
	)
	const handleMaxChange = useCallback(
		(_, v: string | undefined) => {
			onChange && onChange([domain[0], v ? Number.parseFloat(v) : domain[1]])
		},
		[onChange, domain],
	)

	const fmt = useMemo(() => format(`.${precision}f`), [precision])

	const [flo, fhi] = useMemo(() => {
		// d3-format produces strings, but we just want to use it
		// for clean and consistent decimal precision numbers
		return [parseFloat(fmt(domain[0])), parseFloat(fmt(domain[1]))]
	}, [domain, fmt])

	const barWidth = width / 100 - 1

	// TOOD: it would be nice to use a synchronized internal brush state
	// to update current displayed bounds visually before setting the encoding
	const handleBrushEnd = useCallback(
		newdomain => onChange && onChange(newdomain),
		[onChange],
	)

	// sparkbar uses lines, we therefore want the midpoint of bin
	const x = useCallback((d: any, i: number) => (d.x1 - d.x0) / 2 + d.x0, [])
	const y = useCallback((d: any, i: number) => d.length, [])

	return (
		<Container ref={ref}>
			<Sparkbar
				data={histogram}
				domain={[min, max]}
				brushedDomain={domain}
				width={width}
				height={CHART_HEIGHT}
				barWidth={barWidth}
				x={x}
				y={y}
				onBrushEnd={handleBrushEnd}
			/>
			<LegendAxis
				domain={[min, max]}
				brushedDomain={[flo, fhi]}
				width={width}
				height={AXIS_HEIGHT}
			/>
			{showTextInputs ? (
				<TextContainer>
					<TextItem>
						<TextField
							label="min"
							styles={TEXT_STYLES}
							value={`${flo}`}
							onChange={handleMinChange}
						/>
						<Label>Min</Label>
					</TextItem>
					<TextItem>
						<TextField
							label="max"
							styles={TEXT_STYLES}
							value={`${fhi}`}
							onChange={handleMaxChange}
						/>
						<Label>Max</Label>
					</TextItem>
				</TextContainer>
			) : null}
		</Container>
	)
}

const Container = styled.div``
const TextContainer = styled.div`
	margin-top: 12px;
	display: flex;
	justify-content: space-between;
`
const TextItem = styled.div`
	width: 80px;
	text-align: center;
`
