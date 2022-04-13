/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Column, ElementStyles, Mark } from '../CommunityList.types'
import { Bar } from './Bar'
import { Circle } from './Circle'
import { Text } from './Text'
import { useMemo } from 'react'
import { Community } from '~/types'

interface CellProps {
	community: Community
	column: Column
	hovered?: boolean
	styles?: ElementStyles
}

export const Cell: React.FC<CellProps> = ({
	community,
	column,
	hovered,
	styles = {},
}) => {
	const { mark = Mark.None, width, height } = column
	const Component = useMemo(() => {
		switch (mark) {
			case Mark.Circle:
				return Circle
			case Mark.Rect:
				return Bar
			default:
				return Text
		}
	}, [mark])

	const style = useMemo(() => {
		const markType = Mark[mark].toLocaleLowerCase()
		if (styles && styles[markType]) {
			return styles[markType]
		}
		return {
			marginRight: 1,
			width,
			height,
		}
	}, [height, width, mark, styles])
	return (
		<td style={style}>
			<Component community={community} column={column} hovered={hovered} />
		</td>
	)
}
