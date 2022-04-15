/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { CollapsiblePanel } from '@essex-js-toolkit/themed-components'
import { useDebounceFn } from 'ahooks'
import { op } from 'arquero'
import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import {
	CommunityCollection,
	listColumnNames,
	NodeCollection,
	useTableColumnsByType,
} from '../../../../arquero'
import {
	useCommunitiesTable,
	useSetSelectedCommunity,
	useSetSelectedNodes,
} from '../../../../state'
import { SearchItems } from './SearchItems'
import { SearchPanelHeader } from './SearchPanelHeader'

export interface SearchByIndex {
	index: number
	matchColumns: string[]
	'community.id': string
	'node.id'?: string
	[col: string]: unknown
}

export const SearchPanel: React.FC = () => {
	const [searchText, setSearchText] = useState<string | undefined>()
	const [searchNodeTable, setSearchNodeTable] = useState<
		NodeCollection | undefined
	>()
	const [searchTable, setSearchTable] = useState<
		CommunityCollection | undefined
	>()
	const [isExpanded, setIsExpanded] = useState<boolean>(false)
	const [errorMsg, setErrorMsg] = useState<string | undefined>()
	const [isInFocus, setIsInFocus] = useState<boolean>(false)
	const [isSearching, setIsSearching] = useState<boolean>(false)
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
		(col, row, searchValue): [string, boolean] => {
			const stringValue = modifiedTable.get(col, row)
			let isInSearch = false
			if (stringValue.indexOf(searchValue) > -1) {
				isInSearch = true
			}
			return [stringValue, isInSearch]
		},
		[modifiedTable],
	)

	const getMatchingValuesByRow = useCallback(
		(
			columns: string[],
			searchValue: string,
		): [CommunityCollection, NodeCollection] => {
			const matches: SearchByIndex[] = []
			modifiedTable.scan(row => {
				const o = columns.reduce(
					(acc, col) => {
						const [value, isInSearch] = getColumnByRow(col, row, searchValue)
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
				.filter((d: any, $: any) => op.includes($.match, d['community.id'], 0))
				.ungroup()

			const nodeMatchTable = modifiedTable
				.params({ match: Array.from(nodeids), commIds: nodeCommIds })
				.filter(
					(d: any, $: any) =>
						op.includes($.match, d['node.id'], 0) &&
						op.includes($.commIds, d['community.id'], 0),
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

	const useSearchDebounce = useDebounceFn(
		(searchValue: string) => {
			searchByText(searchValue)
		},
		{
			wait: 10, //wait to search to show spinner
		},
	)

	const searchByText = useCallback(
		(searchValue: string) => {
			// filter out community.pid, need to figure out properly display if we choose to include it
			const cols = columns.filter(d => d !== 'community.pid')
			const [matchTable, matchingValues] = getMatchingValuesByRow(
				cols,
				searchValue,
			)
			if (matchingValues.size < 1) {
				setErrorMsg(`No results found for ${searchText}`)
			}
			setIsExpanded(true)
			setSearchTable(matchTable)
			setSearchNodeTable(matchingValues)
			setIsSearching(false)
		},
		[
			searchText,
			columns,
			setSearchNodeTable,
			getMatchingValuesByRow,
			setSearchTable,
			setErrorMsg,
			setIsExpanded,
			setIsSearching,
		],
	)

	const onSearch = useCallback(
		(searchValue?: string) => {
			if (!searchText && !searchValue) {
				onClear()
			} else {
				if (!searchValue) {
					searchValue = searchText as string
				}
				setErrorMsg(undefined)
				if (columns.length > 0) {
					setIsSearching(true)
					useSearchDebounce.run(searchValue)
				}
			}
		},
		[
			searchText,
			columns,
			onClear,
			setErrorMsg,
			setIsSearching,
			useSearchDebounce,
		],
	)

	const onChange = useCallback(
		(newValue: string): any => {
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
				isSearching={isSearching}
			/>
		),
		[disabled, onClear, onChange, onSearch, onFocusChange, isSearching],
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
