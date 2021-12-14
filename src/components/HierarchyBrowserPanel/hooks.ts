/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ROOT_COMMUNITY_ID } from '../../constants'
import { NavTreeArray, Node } from '../../types'
import {
	ICommunityDetail,
	IEntityDetail,
	INeighborCommunityDetail,
	ILoadParams,
	IHierarchyDataResponse,
	IHierarchyNeighborResponse,
} from '@essex-js-toolkit/hierarchy-browser'
import { useMemo } from 'react'
import {
	findNodesCollectionForCommunity,
	getEdgesFromTableByID,
	NodeCollection,
} from '~/arquero'
import {
	useNavigationState,
	useGroupedByCommunityTable,
	useGroupedByParentTable,
} from '~/state'
import ColumnTable from 'arquero/dist/types/table/column-table'

interface NodeAccum {
	[id: string]: string | number
}

function useCommunitySizes(ids: string[]): NavTreeArray[] {
	const byCommunity = useGroupedByCommunityTable()
	const byParent = useGroupedByParentTable()
	return useMemo(() => {
		return ids.map(id => {
			const nodes = findNodesCollectionForCommunity(id, byParent, byCommunity)
			return { id, size: nodes.size }
		})
	}, [ids, byParent, byCommunity])
}

export function useCommunityList(): ICommunityDetail[] {
	const communityIds = useNavigationState()
	const nodeTableArray = useCommunitySizes(communityIds)
	const communities = useMemo(() => {
		const reverseList = nodeTableArray.reverse()
		// TODO: this swaps in a friendly label for the root, which could be handled more cleanly as an optional label in HB
		return reverseList.map((o: NavTreeArray) => ({
			communityId: o.id === ROOT_COMMUNITY_ID ? 'Root' : o.id,
			size: o.size,
		}))
	}, [nodeTableArray])
	return communities
}

function nodeToEntityDetail(node: Node, columns: string[]): IEntityDetail {
	const attrs = columns.reduce((acc: NodeAccum, k: string) => {
		const value = node.get(k)
		acc[k] = value
		return acc
	}, {} as NodeAccum)
	return { id: node.id, attrs }
}

function nodeColumns(
	nodes: NodeCollection,
	loadParams: ILoadParams,
): IEntityDetail[] {
	const columnNames = nodes.table.columnNames()
	const { offset, count } = loadParams
	const values = nodes.page(
		node => nodeToEntityDetail(node, columnNames),
		offset,
		count,
	)
	return values
}

export function useEntityCallback(): (
	loadParams: ILoadParams,
	byParent: ColumnTable,
	byCommunity: ColumnTable,
) => Promise<IHierarchyDataResponse> {
	async function handleEntityCallback(
		loadParams: ILoadParams,
		byParent: ColumnTable,
		byCommunity: ColumnTable,
	): Promise<IHierarchyDataResponse> {
		const cid = loadParams.communityId
		const selectedNeighbor = findNodesCollectionForCommunity(
			cid === 'Root' ? ROOT_COMMUNITY_ID : cid,
			byParent,
			byCommunity,
		)
		const data: IEntityDetail[] = nodeColumns(selectedNeighbor, loadParams)
		return { data, error: undefined }
	}
	return handleEntityCallback
}

export function useNeighborCallback(): (
	params: ILoadParams,
	nodeTable: ColumnTable,
	edges: ColumnTable,
) => Promise<IHierarchyNeighborResponse> {
	const handleNeighborCallback = async function (
		params: ILoadParams,
		nodeTable: ColumnTable,
		edges: ColumnTable,
	): Promise<IHierarchyNeighborResponse> {
		const neighborTable = getEdgesFromTableByID(
			params.communityId,
			nodeTable,
			edges,
		)

		if (neighborTable) {
			const communityNeighbors = getNeighborIds(
				neighborTable,
				params.communityId,
			)
			return { data: communityNeighbors, error: undefined }
		} else {
			return {
				data: [],
				error: new Error(`No edges found for ${params.communityId}`),
			}
		}
	}

	return handleNeighborCallback
}

function getNeighborIds(counts: ColumnTable, communityId: string) {
	if (counts.numRows() > 0) {
		// scan the edge counts table to create a few table rows
		const max = Math.min(100, counts.numRows())
		const output: INeighborCommunityDetail[] = []
		const key = counts.getter('key')
		const count = counts.getter('count')
		const membership = counts.getter('members')
		counts.scan(
			(
				idx?: number | undefined,
				data?: object | any[] | undefined,
				stop?: (() => void) | undefined,
			) => {
				const k = key(idx)
				const c = count(idx)
				const size = membership(idx)
				if (communityId !== k) {
					output.push({
						communityId: k,
						connections: c,
						edgeCommunityId: communityId,
						size,
					} as INeighborCommunityDetail)
				}
				if (output.length > max) {
					stop && stop()
				}
			},
			true,
		)
		return output
	}
	return []
}
