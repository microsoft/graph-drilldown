/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useBarTextForegroundColor, useHoveredColor } from '../hooks'
import { empty, zero, blank } from './common/defaultParams'
import { CellComponentProps } from './common/types'


export const Bar: React.FC<CellComponentProps> = ({
	community,
	column,
	hovered,
}) => {
	const {
		accessor = empty,
		sizeScale = zero,
		fillScale = blank,
		width = 50,
		height = 10,
	} = column
	const value = accessor(community)
	const textFill = useBarTextForegroundColor()
	const hcolor = useHoveredColor()
	const size = sizeScale(value) || 0
	return (
		<svg width={width} height={height}>
			<rect
				width={size}
				height={height}
				x={width - size}
				fill={hovered ? hcolor : fillScale(community).hex()}
			/>
			<text
				fill={textFill}
				y={height / 2 + 1}
				x={width - 2}
				dominantBaseline={'middle'}
				textAnchor={'end'}
			>
				{value}
			</text>
		</svg>
	)
}
