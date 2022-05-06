/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SelectionState } from '@thematic/core'
import { useCallback } from 'react'
import styled from 'styled-components'

import type { TableRowStyles } from '../CommunityList/CommunityList.types'

export interface CommunityRowProps {
	nodeId: string
	onHover: (id?: string) => void
	onClick: (id: string) => void
	selected: boolean
}

export const NodeListItem = ({
	nodeId,
	onHover,
	onClick,
	selected,
}: CommunityRowProps) => {
	const handleEnter = useCallback(() => onHover(nodeId), [nodeId, onHover])
	const handleLeave = useCallback(() => onHover(), [onHover])

	const handleClick = useCallback(() => onClick(nodeId), [onClick, nodeId])
	return (
		<Tr
			onClick={handleClick}
			onMouseEnter={handleEnter}
			onMouseLeave={handleLeave}
			selected={selected}
			key={`node-row-${nodeId}`}
		>
			<td>{nodeId}</td>
		</Tr>
	)
}

const Tr = styled.tr<TableRowStyles>`
	display: table;
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
