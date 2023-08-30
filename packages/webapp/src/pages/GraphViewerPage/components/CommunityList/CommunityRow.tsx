/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Community } from '@graph-drilldown/types'
import { SelectionState } from '@thematic/core'
import { useCallback } from 'react'
import styled from 'styled-components'

import { Cell } from './Cell'
import type {
	Column,
	CommunityRowStyles,
	TableRowStyles,
} from './CommunityList.types'

export interface CommunityRowProps {
	community: Community
	hovered: boolean
	columns: Column[]
	onHover: (community?: Community) => void
	onClick: (community: Community) => void
	styles?: CommunityRowStyles
	selected?: boolean
}

export const CommunityRow = ({
	community,
	hovered,
	columns,
	onHover,
	onClick,
	styles = {},
	selected,
}: CommunityRowProps) => {
	const handleEnter = useCallback(
		() => onHover(community),
		[community, onHover],
	)
	const handleLeave = useCallback(() => onHover(), [onHover])
	const handleClick = useCallback(
		() => onClick(community),
		[community, onClick],
	)

	return (
		<Tr
			onMouseEnter={handleEnter}
			onMouseLeave={handleLeave}
			onClick={handleClick}
			style={styles.tableRow || {}}
			selected={selected}
		>
			{columns.map((c) => {
				return (
					<Cell
						key={`comm-row-col-${c.header}-${community.id}`}
						community={community}
						column={c}
						hovered={hovered}
						styles={styles.tableElements}
					/>
				)
			})}
		</Tr>
	)
}

const Tr = styled.tr<TableRowStyles>`
	width: 100%;
	cursor: pointer;
	color: ${({ theme }) => theme.text().fill().hex()};
	background-color: ${({ selected, theme }: any) =>
		selected
			? `${theme
					.rect({ selectionState: SelectionState.Selected })
					.fill()
					.hex()}`
			: 'inherit'};
	&&:hover {
		background-color: ${({ theme }) =>
			`${theme
				.rect({ selectionState: SelectionState.Hovered })
				.fill()
				.hex()} !important`};
		user-select: none;
	}
`
