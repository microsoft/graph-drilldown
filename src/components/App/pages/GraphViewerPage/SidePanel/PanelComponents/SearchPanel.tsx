/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	CommunityCollection,
	listColumnNames,
	NodeCollection,
	useTableColumnsByType,
} from '../../../../../../arquero'
import {
	useCommunitiesTable,
	useSetSelectedCommunity,
	useSetSelectedNodes,
} from '../../../../../../state'
import { SearchItems } from './SearchItems'
import { SearchPanelHeader } from './SearchPanelHeader'
import { CollapsiblePanel } from '@essex-js-toolkit/themed-components'
import { op, table } from 'arquero'
import { useCallback, useState, useMemo } from 'react'
import styled from 'styled-components'

export interface SearchByIndex {
	index: number
	matchColumns: string[]
	'community.id': string
	'node.id'?: string
	[col: string]: unknown
}

export const SearchPanel: React.FC = () => {
	const [searchText, setSearchText] = useState<string | undefined>()
	const [searchNodeTable, setSearchNodeTable] =
		useState<NodeCollection | undefined>()
	const [searchTable, setSearchTable] =
		useState<CommunityCollection | undefined>()
	const [isExpanded, setIsExpanded] = useState<boolean>(false)
	const [errorMsg, setErrorMsg] = useState<string | undefined>()
	const [isInFocus, setIsInFocus] = useState<boolean>(false)
	const setSelectedNode = useSetSelectedNodes()
	const modifiedTable = useTableColumnsByType('string')
	const columns = listColumnNames(modifiedTable)
	const communities = useCommunitiesTable()

	const onFocusChange = useCallback(
		(state: boolean) => setIsInFocus(state),
		[setIsInFocus],
	)

	const onPanelClick = useCallback(
		(state: boolean) => {
			// dont set expand state if using searchbox
			if (!isInFocus) {
				setIsExpanded(state)
			}
		},
		[setIsExpanded, isInFocus],
	)

	const setSelectedCommunity = useSetSelectedCommunity()

	const getColumnByRow = useCallback(
		(col, row): [string, boolean] => {
			const stringValue = modifiedTable.get(col, row)
			let isInSearch = false
			if (stringValue.indexOf(searchText) > -1) {
				isInSearch = true
			}
			return [stringValue, isInSearch]
		},
		[modifiedTable, searchText],
	)

	const getMatchingValuesByRow = useCallback(
		(columns: string[]): [table, table] => {
			const matches: SearchByIndex[] = []
			modifiedTable.scan(row => {
				const o = columns.reduce(
					(acc, col) => {
						const [value, isInSearch] = getColumnByRow(col, row)
						if (isInSearch) {
							acc.isInSearch = true
							acc.matchColumns.push(col)
						}
						acc[col] = value
						acc.index = row
						return acc
					},
					{ isInSearch: false, matchColumns: [] } as any,
				)

				if (o.isInSearch) {
					matches.push(o)
				}
			})
			// currently only handling match on node.id or community.id
			const seen = new Set<string>([])
			const [nodeids, nodeCommIds, communityIds] = matches.reduce(
				(acc, d) => {
					if (d.matchColumns.includes('node.id')) {
						const nodeid = d['node.id']!
						if (!seen.has(nodeid)) {
							acc[1].push(d['community.id'])
							seen.add(nodeid)
						}
					}
					if (d.matchColumns.includes('community.id')) {
						acc[2].push(d['community.id'])
					}

					return acc
				},
				[seen, [], []] as [Set<string>, string[], string[]],
			)
			const matchTable = communities
				.params({ match: communityIds })
				.filter((d: any, $: any) => op.includes($.match, d['community.id']))
				.ungroup()

			const nodeMatchTable = modifiedTable
				.params({ match: Array.from(nodeids), commIds: nodeCommIds })
				.filter(
					(d: any, $: any) =>
						op.includes($.match, d['node.id']) &&
						op.includes($.commIds, d['community.id']),
				)
				.ungroup()
			const ccTable = new CommunityCollection(matchTable)
			const nodeTable = new NodeCollection(nodeMatchTable)
			return [ccTable, nodeTable]
		},
		[modifiedTable, getColumnByRow, communities],
	)

	const onClear = useCallback(() => {
		// Clear Result
		setSearchText(undefined)
		setSearchNodeTable(undefined)
		setSearchTable(undefined)
		setSelectedNode(undefined)
		setErrorMsg(undefined)
		setSelectedCommunity('-1')
		setIsExpanded(false)
	}, [
		setSearchText,
		setSearchNodeTable,
		setErrorMsg,
		setSearchTable,
		setSelectedNode,
		setSelectedCommunity,
		setIsExpanded,
	])

	const onSearch = useCallback(() => {
		if (!searchText) {
			onClear()
		} else {
			setErrorMsg(undefined)
			if (columns.length > 0) {
				// filter out community.pid, need to figure out properly display if we choose to include it
				const cols = columns.filter(d => d !== 'community.pid')
				const [matchTable, matchingValues] = getMatchingValuesByRow(cols)
				if (matchingValues.size < 1) {
					setErrorMsg(`No results found for ${searchText}`)
				}
				setIsExpanded(true)
				setSearchTable(matchTable)
				setSearchNodeTable(matchingValues)
			}
		}
	}, [
		searchText,
		columns,
		setSearchNodeTable,
		onClear,
		getMatchingValuesByRow,
		setSearchTable,
		setErrorMsg,
		setIsExpanded,
	])

	const onChange = useCallback(
		(event?: React.ChangeEvent<HTMLInputElement>, newValue?: string): any => {
			setSearchText(newValue)
		},
		[setSearchText],
	)

	const disabled = useMemo(() => modifiedTable.numRows() < 1, [modifiedTable])

	const onRenderSearchHeader = useCallback(
		() => (
			<SearchPanelHeader
				disabled={disabled}
				onChange={onChange}
				onSearch={onSearch}
				onClear={onClear}
				onFocusChange={onFocusChange}
			/>
		),
		[disabled, onClear, onChange, onSearch, onFocusChange],
	)

	return (
		<CollapsiblePanel
			onRenderHeader={onRenderSearchHeader}
			defaultExpanded={false}
			onHeaderClick={onPanelClick}
			expandedState={isExpanded}
		>
			<Content>
				{searchTable && (
					<SearchItems
						searchNodeTable={searchNodeTable}
						searchTable={searchTable}
						errorMsg={errorMsg}
					/>
				)}
			</Content>
		</CollapsiblePanel>
	)
}

const Content = styled.div``
