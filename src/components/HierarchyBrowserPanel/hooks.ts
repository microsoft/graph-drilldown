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
import { table } from 'arquero'
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
	byParent: table,
	byCommunity: table,
) => Promise<IHierarchyDataResponse> {
	async function handleEntityCallback(
		loadParams: ILoadParams,
		byParent: table,
		byCommunity: table,
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
	nodeTable: table,
	edges: table,
) => Promise<IHierarchyNeighborResponse> {
	const handleNeighborCallback = async function (
		params: ILoadParams,
		nodeTable: table,
		edges: table,
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

function getNeighborIds(counts: table, communityId: string) {
	if (counts.numRows() > 0) {
		// scan the edge counts table to create a few table rows
		const max = Math.min(100, counts.numRows())
		const output: INeighborCommunityDetail[] = []
		const key = counts.getter('key')
		const count = counts.getter('count')
		const membership = counts.getter('members')
		counts.scan((idx: number, data: any, stop: () => void) => {
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
				stop()
			}
		}, true)
		return output
	}
	return []
}
