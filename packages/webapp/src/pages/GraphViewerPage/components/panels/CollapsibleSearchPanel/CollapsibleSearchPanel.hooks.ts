/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	CommunityCollection,
	NodeCollection,
} from '@graph-drilldown/arquero'
import { listColumnDefs } from '@graph-drilldown/arquero'
import { table } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback, useMemo, useState } from 'react'

import { ROOT_COMMUNITY_ID } from '~/constants'
import { SearchController } from '~/controllers/SearchController'
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
) {
	const [canSearch, setCanSearch] = useState<boolean>(false)
	const [isSearching, setIsSearching] = useState<boolean>(false)
	const [nodeResults, setNodeResults] = useState<NodeCollection | undefined>()
	const [communityResults, setCommunityResults] = useState<
		CommunityCollection | undefined
	>()
	const [errorMessage, setErrorMessage] = useState<string | undefined>()

	const syncState = useCallback(
		controller => {
			setErrorMessage(controller.error)
			setCommunityResults(controller.communityResults)
			setNodeResults(controller.nodeResults)
			setCanSearch(controller.canSearch)
			setIsSearching(controller.searching)
		},
		[setErrorMessage, setCommunityResults, setNodeResults, setIsSearching],
	)

	const controller = useMemo(() => {
		const start = ctl => {
			syncState(ctl)
			onStartSearch()
		}
		const newController = new SearchController({
			nodes,
			communities,
			onStart: start,
			onFinish: syncState,
		})
		syncState(newController)
		return newController
	}, [nodes, communities, syncState, onStartSearch])

	const doSearch = useCallback(text => controller.search(text), [controller])

	return {
		canSearch,
		isSearching,
		nodeResults,
		communityResults,
		errorMessage,
		doSearch,
	}
}

export function useInteraction() {
	const [isExpanded, setIsExpanded] = useState<boolean>(false)

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
		setIsExpanded(false)
	}, [setIsExpanded])

	const doResultsExpand = useCallback(
		() => setIsExpanded(true),
		[setIsExpanded],
	)
	return {
		isExpanded,
		onFocusChange,
		onPanelClick,
		onReset,
		doResultsExpand,
	}
}

/**
 * Subselect the source table to only columns we want
 * to search on. This means they must be a string data type,
 * and we skip the community.pid since that will be redundant with community.id
 */
export function useSearchableTable(source: ColumnTable) {
	return useMemo(() => {
		if (source.numRows() > 0) {
			const def = listColumnDefs(source)
			const columns = def
				.filter(d => d.dataType === 'string')
				.filter(d => d.name !== 'community.pid')
				.map(d => d.name)

			return source.select(columns)
		}
		return table({})
	}, [source])
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
