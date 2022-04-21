/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	CommunityCollection,
	listColumnDefs,
	listColumnNames,
	NodeCollection,
} from '@graph-drilldown/arquero'
import { useDebounceFn } from 'ahooks'
import { op, table } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback, useMemo, useState } from 'react'

import { ROOT_COMMUNITY_ID } from '~/constants'
import {
	useHoveredCommunity,
	useHoveredNode,
	useSelectedCommunity,
	useSelectedNodesState,
	useSetHoveredCommunity,
	useSetHoveredNode,
	useSetSelectedCommunity,
	useSetSelectedNodes,
} from '~/state'

export interface SearchByIndex {
	index: number
	matchColumns: string[]
	'community.id': string
	'node.id'?: string
	[col: string]: unknown
}

export function useSelection() {
	const selectedNodes = useSelectedNodesState()

	const onSelectNodes = useSetSelectedNodes()

	const selectedCommunity = useSelectedCommunity()
	const onSelectCommunity = useSetSelectedCommunity()

	const hoveredNode = useHoveredNode()
	const onHoverNode = useSetHoveredNode()

	const hoveredCommunity = useHoveredCommunity()
	const onHoverCommunity = useSetHoveredCommunity()

	const onResetSelection = useCallback(() => {
		onSelectNodes(undefined)
		onSelectCommunity(ROOT_COMMUNITY_ID)
		onHoverNode(undefined)
		onHoverCommunity(undefined)
	}, [onSelectNodes, onSelectCommunity, onHoverNode, onHoverCommunity])

	return {
		selectedNodes,
		onSelectNodes,
		selectedCommunity,
		onSelectCommunity,
		hoveredNode,
		onHoverNode,
		hoveredCommunity,
		onHoverCommunity,
		onResetSelection,
	}
}

export function useSearch(
	nodes: ColumnTable,
	communities: ColumnTable,
	onStartSearch,
	onError,
	onResetSearch,
) {
	const [isSearching, setIsSearching] = useState<boolean>(false)

	const [nodeResults, setNodeResults] = useState<NodeCollection | undefined>()
	const [communityResults, setCommunityResults] = useState<
		CommunityCollection | undefined
	>()

	const canSearch = useMemo(() => nodes.numRows() > 0, [nodes])

	const handleResetSearch = useCallback(() => {
		onResetSearch()
		onError(undefined)
		setNodeResults(undefined)
		setCommunityResults(undefined)
	}, [onResetSearch, onError, setNodeResults, setCommunityResults])

	const handleStartSearch = useCallback(() => {
		handleResetSearch()
		setIsSearching(true)
		onStartSearch()
	}, [handleResetSearch, setIsSearching, onStartSearch])

	const handleFinishSearch = useCallback(
		(communityResults, nodeResults, error) => {
			onError(error)
			setCommunityResults(communityResults)
			setNodeResults(nodeResults)
			setIsSearching(false)
		},
		[onError, setCommunityResults, setNodeResults, setIsSearching],
	)

	const doSearch = useCreateSearchHandler(
		nodes,
		communities,
		handleStartSearch,
		handleFinishSearch,
		handleResetSearch,
	)

	return {
		canSearch,
		isSearching,
		nodeResults,
		communityResults,
		doSearch,
	}
}

// centralize the debounced search mechanics to return a single searching callback
function useCreateSearchHandler(
	nodes: ColumnTable,
	communities: ColumnTable,
	onStartSearch,
	onFinishSearch,
	onResetSearch,
) {
	const columns = useMemo(() => listColumnNames(nodes), [nodes])

	const runSearch = useCallback(
		(searchValue: string) => {
			const [communityResults, nodeResults, error] = getMatchingValuesByRow(
				nodes,
				communities,
				columns,
				searchValue,
			)
			onFinishSearch(communityResults, nodeResults, error)
		},
		[nodes, communities, columns, onFinishSearch],
	)

	// setup a debounce so we get a render loop to update with
	const debounce = useDebounceFn(
		(searchValue: string) => {
			runSearch(searchValue)
		},
		{
			wait: 10,
		},
	)

	return useCallback(
		(searchValue?: string) => {
			if (!searchValue) {
				onResetSearch()
			} else {
				onStartSearch()
				debounce.run(searchValue)
			}
		},
		[onResetSearch, onStartSearch, debounce],
	)
}

export function useInteraction() {
	const [isExpanded, setIsExpanded] = useState<boolean>(false)
	const [errorMessage, onError] = useState<string | undefined>()
	const [isInFocus, setIsInFocus] = useState<boolean>(false)

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

	const onReset = useCallback(() => {
		onError(undefined)
		setIsExpanded(false)
	}, [onError, setIsExpanded])

	const doSearchExpand = useCallback(() => setIsExpanded(true), [setIsExpanded])
	return {
		isExpanded,
		errorMessage,

		onFocusChange,
		onPanelClick,
		onReset,
		onError,
		doSearchExpand,
	}
}

/**
 * Subselect the nodes table to only columns we want
 * to search on. This means they must be a string data type,
 * and we skip the community.pid since that will be redundant with community.id
 */
export function useSearchableTable(nodes: ColumnTable) {
	return useMemo(() => {
		if (nodes.numRows() > 0) {
			const def = listColumnDefs(nodes)
			const columns = def
				.filter(d => d.dataType === 'string')
				.filter(d => d.name !== 'community.pid')
				.map(d => d.name)

			return nodes.select(columns)
		}
		return table({})
	}, [nodes])
}

function kFormatter(num: number): string {
	return Math.abs(num) > 999
		? (Math.abs(num) / 1000).toFixed(1) + 'k'
		: `${Math.sign(num) * Math.abs(num)}`
}

export function useSearchResultsText(communities, nodes) {
	return useMemo(() => {
		const totalCommunity = communities ? communities.size : 0
		const totalNodes = nodes ? nodes.size : 0
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
	}, [communities, nodes])
}

const getColumnByRow = (table, col, row, searchValue): [string, boolean] => {
	const stringValue = table.get(col, row)
	let isInSearch = false
	if (stringValue.indexOf(searchValue) > -1) {
		isInSearch = true
	}
	return [stringValue, isInSearch]
}

const getMatchingValuesByRow = (
	nodes: ColumnTable,
	communities: ColumnTable,
	columns: string[],
	searchValue: string,
): [CommunityCollection, NodeCollection, string | undefined] => {
	console.time('match')
	const matches: SearchByIndex[] = []
	nodes.scan(row => {
		const o = columns.reduce(
			(acc, col) => {
				const [value, isInSearch] = getColumnByRow(nodes, col, row, searchValue)
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
	const communityResults = communities
		.params({ match: communityIds })
		.filter((d: any, $: any) => op.includes($.match, d['community.id'], 0))
		.ungroup()

	const nodeResults = nodes
		.params({ match: Array.from(nodeids), commIds: nodeCommIds })
		.filter(
			(d: any, $: any) =>
				op.includes($.match, d['node.id'], 0) &&
				op.includes($.commIds, d['community.id'], 0),
		)
		.ungroup()
	const ccTable = new CommunityCollection(communityResults)
	const nodeTable = new NodeCollection(nodeResults)
	const message =
		ccTable.size === 0 && nodeTable.size === 0
			? `No results found for "${searchValue}"`
			: undefined
	console.timeEnd('match')

	return [ccTable, nodeTable, message]
}
