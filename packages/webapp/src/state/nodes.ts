/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil'

import { findGroupIndices, NodeCollection } from '~/arquero'

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
const selectedNodesState = atom<NodeCollection | undefined>({
	key: 'selected-node',
	default: undefined,
})

export function useSelectedNodesState() {
	return useRecoilValue(selectedNodesState)
}

export function useSetSelectedNodes() {
	return useSetRecoilState(selectedNodesState)
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
