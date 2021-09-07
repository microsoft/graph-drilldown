/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematicColorScale } from '../../hooks/graph'
import { ColorEncoding } from '../../types'
import { useThematic } from '@thematic/react'
import { useMemo } from 'react'

const ITEM_GAP = 2

export interface NominalChipsProps {
	encoding: ColorEncoding
	width?: number
	height?: number
	maxItems?: number
}

export const VerticalNominalChips: React.FC<NominalChipsProps> = ({
	encoding,
	width = 200,
	height = 10,
	maxItems = 10,
}) => {
	const scale = useThematicColorScale(encoding)
	const { uniques = [] } = encoding
	const theme = useThematic()
	// TODO: it would be much nicer if the sort matched that of the community list,
	// or at least tried to be a clean numerical when possible
	const items = useMemo(
		() =>
			[...uniques]
				.map(v => `${v}`)
				.sort((a: any, b: any) => a.localeCompare(b))
				.slice(0, maxItems),
		[uniques, maxItems],
	)

	const itemsHeight = items.length * (height + ITEM_GAP)
	// add one more row for "more..." label if truncated
	const totalHeight =
		items.length < uniques.length ? itemsHeight + height : itemsHeight

	const rows = useMemo(() => {
		const textColor = theme.text().fill().hex()
		const r = height / 2
		const legendRows = items.map((item: any, i: number) => {
			const color = scale(item).hex()
			const cy = r + i * (height + ITEM_GAP)
			return (
				<g key={`vertical-nominal-chips-${item}-${i}`}>
					<circle fill={color} cx={r} cy={cy} r={r} />
					<text
						x={height + ITEM_GAP * 2}
						y={cy + ITEM_GAP}
						fill={textColor}
						fontSize={12}
						dominantBaseline={'middle'}
					>
						{item}
					</text>
				</g>
			)
		})
		const delta = uniques.length - items.length
		if (delta > 0) {
			legendRows.push(
				<text
					key={`vertical-nominal-chips-more-${items.length}`}
					x={2}
					y={items.length * (height + ITEM_GAP) + r}
					fontSize={11}
					fill={textColor}
					dominantBaseline={'middle'}
				>{`+${delta} more`}</text>,
			)
		}
		return legendRows
	}, [theme, scale, height, items, uniques])
	return (
		<svg width={width} height={totalHeight}>
			{rows}
		</svg>
	)
}
