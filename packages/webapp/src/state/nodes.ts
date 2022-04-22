/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { findGroupIndices, NodeCollection } from '@graph-drilldown/arquero'
import type { Node } from '@graph-drilldown/types'
import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil'

import { ROOT_COMMUNITY_ID } from '../constants'
import { groupedParentsTableState } from './tables'

const hoveredNodeState = atom<string | undefined>({
	key: 'hovered-node',
	default: undefined,
})

export function useHoveredNode() {
	return useRecoilValue(hoveredNodeState)
}

export function useSetHoveredNode() {
	return useSetRecoilState(hoveredNodeState)
}

// Tracks nodes selected from search
const selectedNodeState = atom<Node | undefined>({
	key: 'selected-node',
	default: undefined,
})

export function useSelectedNode() {
	return useRecoilValue(selectedNodeState)
}

export function useSetSelectedNode() {
	return useSetRecoilState(selectedNodeState)
}

// this is a list of the unique nodes, which is defined as all those for
// communities with no parent, i.e., the roots
// note that they will therefore have root community properties
export const uniqueNodesState = selector<NodeCollection>({
	key: 'unique-nodes',
	get: ({ get }) => {
		const parents = get(groupedParentsTableState)
		const indices = findGroupIndices(
			parents,
			'community.pid',
			ROOT_COMMUNITY_ID,
		)
		return new NodeCollection(parents, indices)
	},
	dangerouslyAllowMutability: true,
})

export function useUniqueNodes() {
	return useRecoilValue(uniqueNodesState)
}
