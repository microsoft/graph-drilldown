/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ColorEncoding, NumericEncoding } from '@graph-drilldown/types'
import { DataBinding } from '@graph-drilldown/types'
import { useMemo } from 'react'
import styled from 'styled-components'

import { ColorRangeText } from './ColorRangeText.js'
import { Dashes } from './Dashes.js'
import { Dots } from './Dots.js'
import { LegendLabel } from './LegendLabel.js'
import { NumericRangeText } from './NumericRangeText.js'

// TODO: width should flex
// base + padding accounts for border-box in css, literal in svg
const LEGEND_WIDTH_BASE = 250
const LEGEND_WIDTH_PADDING = 10
const LEGEND_WIDTH = LEGEND_WIDTH_BASE + LEGEND_WIDTH_PADDING
const LEGEND_HEIGHT_BASE = 20
const LEGEND_HEIGHT_PADDING = 10
const LEGEND_HEIGHT = LEGEND_HEIGHT_BASE + LEGEND_HEIGHT_PADDING
const LEGEND_ITEMS = 11
const RANGE_HEIGHT = 12

export interface HeaderLegendProps {
	label: string
	encoding: NumericEncoding | ColorEncoding
	colorEncoding?: ColorEncoding
	sizeEncoding?: NumericEncoding
	opacityEncoding?: NumericEncoding
	isUnset?: boolean
	isDashes?: boolean
	isNumeric?: boolean
}

/**
 * A compact horizontal legend designed to fit in panel headers.
 */
export const HeaderLegend: React.FC<HeaderLegendProps> = ({
	label,
	encoding,
	colorEncoding,
	sizeEncoding,
	opacityEncoding,
	isUnset,
	isDashes,
	isNumeric,
}) => {
	return (
		<Container>
			<LegendLabel
				label={label}
				binding={encoding.binding}
				field={encoding.field}
				fixedValue={`${encoding.value}`}
				paletteValue={'from palette'}
				unset={isUnset}
			/>
			{!isUnset ? (
				<Legend>
					<LabeledLegend
						label={label}
						encoding={encoding}
						colorEncoding={colorEncoding}
						sizeEncoding={sizeEncoding}
						opacityEncoding={opacityEncoding}
						isDashes={isDashes}
						isNumeric={isNumeric}
					/>
				</Legend>
			) : null}
		</Container>
	)
}

const LabeledLegend: React.FC<HeaderLegendProps> = ({
	encoding,
	colorEncoding,
	sizeEncoding,
	opacityEncoding,
	isDashes,
	isNumeric,
}) => {
	const fixed = useMemo(
		() => encoding.binding !== DataBinding.Scaled,
		[encoding],
	)
	const height = useMemo(
		() => (fixed ? LEGEND_HEIGHT : LEGEND_HEIGHT + RANGE_HEIGHT + 4),
		[fixed],
	)
	const Marks = isDashes ? Dashes : Dots

	const rangeText = useRangeText(encoding, isNumeric)

	return (
		<LegendContainer width={LEGEND_WIDTH} height={height}>
			<LegendSection>
				<Marks
					colorEncoding={colorEncoding}
					sizeEncoding={sizeEncoding}
					opacityEncoding={opacityEncoding}
					width={LEGEND_WIDTH_BASE}
					height={LEGEND_HEIGHT_BASE}
					maxItems={LEGEND_ITEMS}
				/>
			</LegendSection>
			{!fixed ? rangeText : null}
		</LegendContainer>
	)
}

function useRangeText(encoding: ColorEncoding | NumericEncoding, isNumeric) {
	return (
		<RangeSection>
			{isNumeric ? (
				<NumericRangeText includeMidpoint domain={encoding.domain} />
			) : (
				<ColorRangeText encoding={encoding as ColorEncoding} includeMidpoint />
			)}
		</RangeSection>
	)
}

const Container = styled.div`
	margin: 2px;
	margin-left: 4px;
`

const LegendContainer = styled.div<{
	width: number
	height: number
}>`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	width: ${({ width }) => width}px;
	height: ${({ height }) => height}px;
	padding: 4px;
	border-radius: 2px;
	color: ${({ theme }) => theme.text().fill().hex()};
	background-color: ${({ theme }) => theme.plotArea().fill().hex()};
	border: 1px solid ${({ theme }) => theme.plotArea().stroke().hex()};
`

const Legend = styled.div`
	margin-top: 8px;
	margin-bottom: 4px;
`
const LegendSection = styled.div`
	height: ${LEGEND_HEIGHT}px;
`

const RangeSection = styled.div`
	height: ${RANGE_HEIGHT}px;
`
