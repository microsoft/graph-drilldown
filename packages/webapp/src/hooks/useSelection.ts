/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	findNodesCollectionForCommunity,
	NodeCollection,
} from '@graph-drilldown/arquero'
import { useCallback, useMemo } from 'react'

import { ROOT_COMMUNITY_ID } from '~/constants'
import {
	useGroupedByCommunityTable,
	useGroupedByParentTable,
	useHoveredCommunity,
	useHoveredNode,
	useSelectedCommunity,
	useSelectedNode,
	useSetHoveredCommunity,
	useSetHoveredNode,
	useSetSelectedCommunity,
	useSetSelectedNode,
} from '~/state'

import { useVisibleNodesTable } from './graph'
/**
 * Provides business logic methods for manipulating the
 * currently hovered and selected nodes and communities.
 */
export function useSelection() {
	const selectedNode = useSelectedNode()
	const onSelectNode = useSetSelectedNode()
	const selectedCommunity = useSelectedCommunity()
	const onSelectCommunity = useSetSelectedCommunity()

	const hoveredNode = useHoveredNode()
	const onHoverNode = useSetHoveredNode()

	// these two are derived from the hovered/selected community
	const selectedNodes = useSelectedNodes()
	const hoveredNodes = useHoveredNodes()

	const hoveredCommunity = useHoveredCommunity()
	const onHoverCommunity = useSetHoveredCommunity()

	const onResetSelection = useCallback(() => {
		onSelectNode(undefined)
		onSelectCommunity(ROOT_COMMUNITY_ID)
		onHoverNode(undefined)
		onHoverCommunity(undefined)
	}, [onSelectNode, onSelectCommunity, onHoverNode, onHoverCommunity])

	return {
		selectedNodes,
		selectedNode,
		onSelectNode,
		selectedCommunity,
		onSelectCommunity,
		hoveredNodes,
		hoveredNode,
		onHoverNode,
		hoveredCommunity,
		onHoverCommunity,
		onResetSelection,
	}
}

function useHoveredNodes() {
	const hovered = useHoveredCommunity()
	const byParent = useGroupedByParentTable()
	const byCommunity = useGroupedByCommunityTable()
	return useMemo(
		() => findNodesCollectionForCommunity(hovered, byParent, byCommunity),
		[hovered, byParent, byCommunity],
	)
}

export function useSelectedNodes() {
	const selected = useSelectedCommunity()
	const table = useVisibleNodesTable()
	return useMemo(
		() =>
			new NodeCollection(selected === ROOT_COMMUNITY_ID ? undefined : table),
		[selected, table],
	)
}
