/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ColumnTable from 'arquero/dist/types/table/column-table'
import {
	atom,
	selector,
	selectorFamily,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'
import { findNodesTableForCommunity, getNodeStats } from '~/arquero'
import { table } from 'arquero'

export const bigTableState = atom<ColumnTable>({
	key: 'big-table',
	default: table({}),
	// this is required so that arquero can update indexes under the hood
	dangerouslyAllowMutability: true,
})

export function useBigTable() {
	return useRecoilValue(bigTableState)
}

export function useSetBigTable() {
	return useSetRecoilState(bigTableState)
}

export function useResetBigTable() {
	return useResetRecoilState(bigTableState)
}
// keep ahold of a pre-grouped copy of the big table,
// because all of our interactions are based around communities
const groupedCommunitiesTableState = selector<ColumnTable>({
	key: 'grouped-community-table',
	dangerouslyAllowMutability: true,
	get: ({ get }) => {
		console.log('deriving pre-grouped community table')
		const bigTable = get(bigTableState)
		if (bigTable.numRows() === 0) {
			return table({})
		}
		console.time('groupby community state')
		const grouped = bigTable.groupby('community.id')
		console.timeEnd('groupby community state')
		return grouped
	},
})

export function useGroupedByCommunityTable() {
	return useRecoilValue(groupedCommunitiesTableState)
}

export const groupedParentsTableState = selector<ColumnTable>({
	key: 'grouped-parent-community-table',
	dangerouslyAllowMutability: true,
	get: ({ get }) => {
		console.log('deriving pre-grouped parent community table')
		const bigTable = get(bigTableState)
		if (bigTable.numRows() === 0) {
			return table({})
		}
		console.time('groupby parent state')
		const grouped = bigTable.groupby('community.pid')
		console.timeEnd('groupby parent state')
		return grouped
	},
})

export function useGroupedByParentTable() {
	return useRecoilValue(groupedParentsTableState)
}

// returns a table representing only the nodes for the selected community
export const communityNodesTableState = selectorFamily<ColumnTable, string>({
	key: 'community-nodes-table',
	get:
		cid =>
		({ get }) => {
			const byParent = get(groupedParentsTableState)
			const byCommunity = get(groupedCommunitiesTableState)
			return findNodesTableForCommunity(cid, byParent, byCommunity)
		},
	dangerouslyAllowMutability: true,
})

export function useCommunityNodesTable(cid: string) {
	return useRecoilValue(communityNodesTableState(cid))
}

// creates a single row per community in the app (just grabbing the first from each group in the big table)
const communitiesTableState = selector<ColumnTable>({
	key: 'communities-table',
	get: ({ get }) => {
		const byCommunity = get(groupedCommunitiesTableState)
		console.time('communities state')
		const groups = byCommunity.groups()
		const tbl = groups ? byCommunity.reify(groups.rows) : table({})
		console.timeEnd('communities state')
		return tbl
	},
	dangerouslyAllowMutability: true,
})

export function useCommunitiesTable() {
	return useRecoilValue(communitiesTableState)
}

const communityNodeStatsState = selectorFamily<
	any,
	{ cid: string; quantile: number }
>({
	key: 'grouped-node-stats',
	get:
		param =>
		({ get }) => {
			const { cid, quantile } = param
			const table = get(communityNodesTableState(cid))
			return getNodeStats(table, quantile)
		},
})

export function useNodeStatsByCommunity(cid: string, quantile: number) {
	return useRecoilValue(communityNodeStatsState({ cid, quantile }))
}

// standalone edge table
// we don't want to join that with the node/community table,
// as it would be massive and not useful
export const edgeTableState = atom<ColumnTable>({
	key: 'edge-table',
	default: table({}),
	dangerouslyAllowMutability: true,
})

export function useEdgeTable() {
	return useRecoilValue(edgeTableState)
}

export function useSetEdgeTable() {
	return useSetRecoilState(edgeTableState)
}

export function useResetEdgeTable() {
	return useResetRecoilState(edgeTableState)
}
