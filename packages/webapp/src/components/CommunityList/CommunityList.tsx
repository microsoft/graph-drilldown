/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from 'styled-components'

import type { CommunityCollection } from '~/arquero'

import {
	useColumns,
	useRowHandling,
	useSortHandling,
} from './CommunityList.hooks'
import { CommunityRow } from './CommunityRow'

export interface CommunityListProps {
	communities: CommunityCollection
	style?: React.CSSProperties
}

/**
 * Displays the list of communities at the currently selected level.
 * Should be color-coded to match the graph, and hover/select.
 */
export const CommunityList = ({ communities, style }: CommunityListProps) => {
	const { hovered, onHover, onClick } = useRowHandling()

	const columns = useColumns(communities)

	const { sorted, onHeaderClick } = useSortHandling(communities)

	return (
		<Container style={style}>
			{sorted.size > 0 ? (
				<TableContainer>
					<Table>
						<thead>
							<tr>
								{columns.map(c => (
									<Th
										key={`comm-th-${c.header}`}
										onClick={() => onHeaderClick(c)}
									>
										{c.header}
									</Th>
								))}
							</tr>
						</thead>
						<tbody>
							{sorted.map(
								comm => (
									<CommunityRow
										key={`community-row-${comm.id}`}
										community={comm}
										onHover={onHover}
										onClick={onClick}
										hovered={comm.id === hovered}
										columns={columns}
									/>
								),
								true,
							)}
						</tbody>
					</Table>
				</TableContainer>
			) : (
				<Empty />
			)}
		</Container>
	)
}

const Container = styled.div`
	font-size: 0.8em;
	text-align: right;
	background: ${({ theme }) => theme.plotArea().fill().hex()};
	color: ${({ theme }) => theme.text().fill().hex()};
`

const TableContainer = styled.div`
	margin: 4;
	display: flex;
	justify-content: center;
`

const Table = styled.table`
	border-spacing: 6px 0px;
`

const Th = styled.th`
	cursor: pointer;
`

const Empty = () => (
	<TableContainer>(no child communities to show)</TableContainer>
)
