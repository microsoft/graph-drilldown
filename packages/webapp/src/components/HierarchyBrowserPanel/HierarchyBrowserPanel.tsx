/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	ICardOverviewSettings,
	ICommunityDetail,
	ILoadNeighborCommunitiesAsync,
	ILoadParams,
	ISettings,
	ITableSettings,
} from '@essex-js-toolkit/hierarchy-browser'
import { HierarchyBrowser } from '@essex-js-toolkit/hierarchy-browser'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { findNodesTableForParent } from '~/arquero'
import {
	useBrowserColumns,
	useEdgeTable,
	useGroupedByCommunityTable,
	useGroupedByParentTable,
} from '~/state'

import { ROOT_COMMUNITY_ID } from '../../constants'
import {
	useCommunityList,
	useEntityCallback,
	useNeighborCallback,
} from './HierarchyBrowerPanel.hooks'

const cardOverview = {
	root: { borderRadius: '0px' },
	headerText: 'mediumPlus',
	subHeaderText: 'xSmall',
} as ICardOverviewSettings
const table = {
	headerText: 'medium',
	subHeaderText: 'xSmall',
	tableItemsText: 'small',
} as ITableSettings

export const HierarchyBrowserPanel: React.FC = memo(
	function HierarchyBrowserPanel() {
		const [browserColumns] = useBrowserColumns()
		const byParent = useGroupedByParentTable()
		const edges = useEdgeTable()
		const byCommunity = useGroupedByCommunityTable()
		const communities = useCommunityList()

		const handleEntityCallback = useEntityCallback()
		const handleNeighborCallback = useNeighborCallback()
		const attrArray = useMemo(
			() => Array.from(browserColumns),
			[browserColumns],
		)

		const loadNeighborsAsync = useCallback(
			(params: ILoadParams) => {
				const pid = findParentId(params, communities)
				const nodeTable = findNodesTableForParent(pid, byParent)
				return handleNeighborCallback(params, nodeTable, edges)
			},
			[edges, handleNeighborCallback, communities, byParent],
		)
		const loadEntitiesAsync = useCallback(
			(params: ILoadParams) =>
				handleEntityCallback(params, byParent, byCommunity),
			[byParent, byCommunity, handleEntityCallback],
		)
		const settings = useMemo(
			() =>
				({
					visibleColumns: attrArray,
					controls: { showLevel: false, showFilter: false },
					styles: { cardOverview, table },
				} as ISettings),
			[attrArray],
		)

		const neighbors = useMemo(
			() =>
				edges.numCols() > 0
					? (loadNeighborsAsync as ILoadNeighborCommunitiesAsync)
					: undefined,
			[edges, loadNeighborsAsync],
		)

		return (
			<Container>
				{communities.length > 0 ? (
					<HierarchyBrowser
						communities={communities}
						entities={loadEntitiesAsync}
						neighbors={neighbors}
						settings={settings}
					/>
				) : null}
			</Container>
		)
	},
)

// get the raw community id for table filtering. note special case for Root
function findParentId(params: ILoadParams, communities: ICommunityDetail[]) {
	if (communities.length === 1) {
		return ROOT_COMMUNITY_ID
	}
	const currentIndex = communities.findIndex(
		c => c.communityId === params.communityId,
	)
	const parentIndex = currentIndex + 1
	const id = communities[parentIndex].communityId
	return id === 'Root' ? ROOT_COMMUNITY_ID : id
}

const Container = styled.div``
