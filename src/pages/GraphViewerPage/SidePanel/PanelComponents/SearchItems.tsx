/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	CommunityCollection,
	listColumnDefs,
	NodeCollection,
} from '../../../../arquero'
import { useNodeIds } from '../../../../hooks/graph'
import {
	useCommunitySort,
	useHoveredCommunity,
	useSelectedCommunity,
	useSelectedNodesState,
	useSetHoveredCommunity,
	useSetHoveredNode,
	useSetSelectedCommunity,
	useSetSelectedNodes,
} from '../../../../state'
import { useColumns } from '../../../../components/CommunityList/CommunityList.hooks'
import { CommunityRowStyles } from '../../../../components/CommunityList/CommunityList.types'
import { CommunityRow } from '../../../../components/CommunityList/CommunityRow'
import { NodeListItem } from './NodeListItem'
import { SearchItemHeader } from './SearchItemHeader'
import { Pivot, PivotItem } from '@fluentui/react'
import { desc, from } from 'arquero'
import { useCallback, useMemo } from 'react'
import styled from 'styled-components'

const ItemStyles = {
	tableElements: { text: { width: '90%' }, circle: { width: '10%' } },
} as CommunityRowStyles

export interface SearchItemsProps {
	searchNodeTable?: NodeCollection
	searchTable: CommunityCollection
	errorMsg?: string
}

export const SearchItems: React.FC<SearchItemsProps> = ({
	searchNodeTable,
	searchTable,
	errorMsg,
}: SearchItemsProps) => {
	const setHoveredCommunity = useSetHoveredCommunity()
	const setSelectedCommunity = useSetSelectedCommunity()
	const selectedCommunityID = useSelectedCommunity()
	const setHoverNode = useSetHoveredNode()
	const hovered = useHoveredCommunity()
	const setSelectedNode = useSetSelectedNodes()
	const selectedNode = useSelectedNodesState()
	const selectedNodeIds = useNodeIds(selectedNode)

	const [sort] = useCommunitySort()
	const sorted = useMemo(() => {
		const { descending, field } = sort
		const order = descending ? desc(field) : field
		return searchTable.sort(order)
	}, [searchTable, sort])

	const handleRowHover = useCallback(
		community => setHoveredCommunity(community?.id),
		[setHoveredCommunity],
	)
	const handleNodeClick = useCallback(
		(nodeid: string) => {
			const alreadySelected = (selectedNodeIds as string[]).includes(nodeid)
			if (alreadySelected) {
				setSelectedNode(undefined)
				setSelectedCommunity('-1')
			} else {
				if (searchNodeTable) {
					let found
					const cols = listColumnDefs(searchNodeTable.table)
					searchNodeTable.scan(
						(
							idx: number | undefined,
							data: any,
							stop: (() => void) | undefined,
						) => {
							const id = data['node.id'].get(idx)
							if (nodeid === id && !found) {
								const obj = cols.reduce((acc, col) => {
									const val = data[col.name].get(idx)
									acc[col.name] = val
									return acc
								}, {})
								found = obj
								stop && stop()
							}
						},
						true,
					)
					if (found) {
						const commId = found['community.id']
						if (commId) {
							setSelectedCommunity(commId)
						}
						const tbl = from([found])
						setSelectedNode(new NodeCollection(tbl))
					}
				}
			}
		},
		[searchNodeTable, setSelectedNode, setSelectedCommunity, selectedNodeIds],
	)
	const handleRowClick = useCallback(
		community => {
			if (community && community.id === selectedCommunityID) {
				setSelectedCommunity('-1')
			} else {
				setSelectedCommunity(community?.id)
			}
			// clear previous selections
			setHoveredCommunity(undefined)
			setSelectedNode(undefined)
		},
		[
			setSelectedCommunity,
			setHoveredCommunity,
			selectedCommunityID,
			setSelectedNode,
		],
	)

	const handleHoverNode = useCallback(
		(id?: string) => setHoverNode(id),
		[setHoverNode],
	)

	const tbl = useMemo(
		() => searchTable || new CommunityCollection(),
		[searchTable],
	)

	const searchColumns = useColumns(tbl, 0)

	const cols = useMemo(
		() =>
			searchColumns && searchColumns.filter(d => d.field === 'community.id'),
		[searchColumns],
	)

	const rows = useMemo(() => {
		if (sorted && cols.length > 0) {
			const rows = sorted.map(comm => {
				return (
					<CommunityRow
						community={comm}
						onHover={handleRowHover}
						onClick={handleRowClick}
						hovered={comm.id === hovered}
						columns={cols}
						styles={ItemStyles}
						selected={selectedCommunityID === comm.id}
						key={`community-row-${comm.id}`}
					/>
				)
			}, true)
			return rows
		}
		return null
	}, [
		sorted,
		hovered,
		cols,
		selectedCommunityID,
		handleRowClick,
		handleRowHover,
	])

	const nodeRows = useMemo(() => {
		if (searchNodeTable) {
			const rows = searchNodeTable.map(node => {
				const nodeid = node.get('node.id')
				const selected = (selectedNodeIds as string[]).includes(nodeid)
				return (
					<NodeListItem
						nodeId={nodeid}
						onHover={handleHoverNode}
						onClick={handleNodeClick}
						selected={selected}
						key={`node-row-${nodeid}`}
					/>
				)
			}, true)
			return rows
		}
		return null
	}, [searchNodeTable, handleHoverNode, handleNodeClick, selectedNodeIds])

	const searchText = useMemo(() => {
		const totalCommunity = searchTable ? searchTable.size : 0
		const totalNodes = searchNodeTable ? searchNodeTable.size : 0
		let communityText = ''
		let nodeText = ''
		if (totalCommunity > 0) {
			communityText =
				totalCommunity > 1
					? `${kFormatter(totalCommunity)} communities`
					: `${totalCommunity} community`
		}
		if (totalNodes > 0) {
			communityText += communityText.length > 0 ? ' & ' : ''
			nodeText =
				totalNodes > 1
					? `${kFormatter(totalNodes)} nodes`
					: `${totalNodes} node`
		}

		return `Found ${communityText} ${nodeText}`
	}, [searchTable, searchNodeTable])

	return (
		<>
			<SearchItemHeader
				numberOfResults={searchNodeTable ? searchNodeTable.size : 0}
				searchText={searchText}
				errorMsg={errorMsg}
			/>
			<Container>
				<Pivot aria-label={'Community or node selection'}>
					{searchTable && searchTable.size > 0 ? (
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
									<tbody>{rows}</tbody>
								</Table>
							</ListContainer>
						</PivotItem>
					) : null}

					{searchNodeTable && searchNodeTable.size > 0 ? (
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
									<tbody>{nodeRows}</tbody>
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
function kFormatter(num: number): string {
	return Math.abs(num) > 999
		? (Math.abs(num) / 1000).toFixed(1) + 'k'
		: `${Math.sign(num) * Math.abs(num)}`
}
