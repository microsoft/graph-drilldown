/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useHoveredColor } from '../CommunityList.hooks'
import type { CellComponentProps } from './Cell.types'
import { blank, empty, zero } from './Cell.util'

export const Circle: React.FC<CellComponentProps> = ({
	community,
	column,
	hovered,
}) => {
	const { sizeScale = zero, fillScale = blank, accessor = empty } = column
	const size = sizeScale(community) || 0
	const value = accessor(community)
	const hcolor = useHoveredColor()
	return (
		<>
			{value}
			<svg width={size * 2} height={size * 2}>
				<title>Community Cell</title>
				<circle
					cx={size}
					cy={size}
					r={size}
					fill={hovered ? hcolor : fillScale(community).hex()}
				/>
			</svg>
		</>
	)
}
