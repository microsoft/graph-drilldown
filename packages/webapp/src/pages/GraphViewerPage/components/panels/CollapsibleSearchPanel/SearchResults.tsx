/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Pivot, PivotItem } from '@fluentui/react'
import type { CommunityCollection} from '@graph-drilldown/arquero';
import { NodeCollection } from '@graph-drilldown/arquero'
import { from } from 'arquero'
import { useCallback } from 'react'
import styled from 'styled-components'

import { useSortHandling } from '~/hooks/communities'
import { useNodeIds } from '~/hooks/graph'

import { useColumns } from '../../CommunityList/CommunityList.hooks'
import type { CommunityRowStyles } from '../../CommunityList/CommunityList.types'
import { CommunityRow } from '../../CommunityList/CommunityRow'
import { NodeListItem } from '../NodeListItem'
import {
	useSearchResultsText,
	useSelection,
} from './CollapsibleSearchPanel.hooks'
import { SearchResultsHeader } from './SearchResultsHeader'

const ItemStyles = {
	tableElements: { text: { width: '90%' }, circle: { width: '10%' } },
} as CommunityRowStyles

export interface SearchResultsProps {
	nodes: NodeCollection
	communities: CommunityCollection
	errorMessage?: string
}

export const SearchResults: React.FC<SearchResultsProps> = ({
	nodes,
	communities,
	errorMessage,
}: SearchResultsProps) => {
	const {
		selectedNodes,
		onSelectNodes,
		selectedCommunity,
		onSelectCommunity,
		onHoverNode,
		hoveredCommunity,
		onHoverCommunity,
		onResetSelection,
	} = useSelection()

	const selectedNodeIds = useNodeIds(selectedNodes)

	const { sorted } = useSortHandling(communities)

	const handleRowHover = useCallback(
		community => onHoverCommunity(community?.id),
		[onHoverCommunity],
	)

	const handleNodeClick = useCallback(
		(nodeid: string) => {
			const alreadySelected = (selectedNodeIds as string[]).includes(nodeid)
			if (alreadySelected) {
				onResetSelection()
			} else {
				if (nodes) {
					const found = nodes.findById(nodeid)
					if (found) {
						const commId = found['community.id']
						if (commId) {
							onSelectCommunity(commId)
						}
						const tbl = from([found])
						onSelectNodes(new NodeCollection(tbl))
					}
				}
			}
		},
		[
			nodes,
			onSelectNodes,
			onSelectCommunity,
			onResetSelection,
			selectedNodeIds,
		],
	)
	const handleRowClick = useCallback(
		community => {
			onResetSelection()
			if (community && community.id !== selectedCommunity) {
				onSelectCommunity(community.id)
			}
		},
		[onResetSelection, onSelectCommunity, selectedCommunity],
	)

	const columns = useColumns(
		communities,
		0,
		0,
		col => col.field === 'community.id',
	)

	const searchText = useSearchResultsText(communities, nodes)

	return (
		<>
			<SearchResultsHeader
				numberOfResults={nodes ? nodes.size : 0}
				searchText={searchText}
				errorMessage={errorMessage}
			/>
			<Container>
				<Pivot aria-label={'Community or node selection'}>
					{communities && communities.size > 0 ? (
						<PivotItem
							headerText="Communities"
							headerButtonProps={{
								'data-order': 1,
								'data-title': 'community matches',
								'aria-label': 'community.id',
							}}
						>
							<ListContainer>
								<Table tabIndex={0}>
									<tbody>
										{sorted && columns.length > 0
											? sorted.map(comm => {
													return (
														<CommunityRow
															community={comm}
															onHover={handleRowHover}
															onClick={handleRowClick}
															hovered={comm.id === hoveredCommunity}
															columns={columns}
															styles={ItemStyles}
															selected={selectedCommunity === comm.id}
															key={`community-row-${comm.id}`}
														/>
													)
											  }, true)
											: null}
									</tbody>
								</Table>
							</ListContainer>
						</PivotItem>
					) : null}

					{nodes && nodes.size > 0 ? (
						<PivotItem
							headerText="Nodes"
							headerButtonProps={{
								'data-order': 2,
								'data-title': 'node matches',
								'aria-label': 'node.id',
							}}
						>
							<ListContainer>
								<Table tabIndex={0}>
									<tbody>
										{nodes
											? nodes.map(node => {
													const nodeid = node.get('node.id')
													const selected = (
														selectedNodeIds as string[]
													).includes(nodeid)
													return (
														<NodeListItem
															nodeId={nodeid}
															onHover={onHoverNode}
															onClick={handleNodeClick}
															selected={selected}
															key={`node-row-${nodeid}`}
														/>
													)
											  }, true)
											: null}
									</tbody>
								</Table>
							</ListContainer>
						</PivotItem>
					) : null}
				</Pivot>
			</Container>
		</>
	)
}

const Container = styled.div`
	display: block;
`

const ListContainer = styled.div`
	overflow: auto;
	margin-top: 5px;
	cursor: pointer;
	max-height: 400px;
`
const Table = styled.table`
	width: 100%;
`
