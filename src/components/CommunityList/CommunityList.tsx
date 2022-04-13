/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useColumns } from './CommunityList.hooks'
import { CommunityRow } from './CommunityRow'
import { desc } from 'arquero'
import { useMemo, useCallback } from 'react'
import styled from 'styled-components'
import { CommunityCollection } from '~/arquero'
import {
	useHoveredCommunity,
	useSetSelectedCommunity,
	useCommunitySort,
	useSetHoveredCommunity,
} from '~/state'

interface CommunityListProps {
	communities: CommunityCollection
	style?: React.CSSProperties
}

/**
 * Displays the list of communities at the currently selected level.
 * Should be color-coded to match the graph, and hover/select.
 */
export const CommunityList = ({ communities, style }: CommunityListProps) => {
	const [sort, setSort] = useCommunitySort()
	const sorted = useMemo(() => {
		const { descending, field } = sort
		const order = descending ? desc(field) : field
		return communities.sort(order)
	}, [communities, sort])

	const hovered = useHoveredCommunity()
	const setHoveredCommunity = useSetHoveredCommunity()
	const setSelectedCommunity = useSetSelectedCommunity()
	const handleRowHover = useCallback(
		community => setHoveredCommunity(community?.id),
		[setHoveredCommunity],
	)
	const handleRowClick = useCallback(
		community => {
			setSelectedCommunity(community?.id)
			setHoveredCommunity(undefined)
		},
		[setSelectedCommunity, setHoveredCommunity],
	)

	const handleHeaderClick = useCallback(
		column => {
			if (sort.field === column.field) {
				setSort({
					...sort,
					descending: !sort.descending,
				})
			} else {
				setSort({
					...sort,
					field: column.field,
				})
			}
		},
		[sort, setSort],
	)

	const columns = useColumns(communities)

	const rows = sorted.map(
		comm => (
			<CommunityRow
				key={`community-row-${comm.id}`}
				community={comm}
				onHover={handleRowHover}
				onClick={handleRowClick}
				hovered={comm.id === hovered}
				columns={columns}
			/>
		),
		true,
	)

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
										onClick={() => handleHeaderClick(c)}
									>
										{c.header}
									</Th>
								))}
							</tr>
						</thead>
						<tbody>{rows}</tbody>
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
