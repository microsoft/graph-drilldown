/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil'
import { ViewType } from '../../types'
import { featuresState } from '../features'

export const graphViewState = atom<ViewType>({
	key: 'graph-view',
	default: ViewType.SingleGraph,
})

export const constrainedGraphViewState = selector<ViewType>({
	key: 'graph-view-contrained',
	get: ({ get }) => {
		const features = get(featuresState)
		const view = get(graphViewState)
		return features.enableSmallMultiples ? view : ViewType.SingleGraph
	},
})

export const nodesVisibleState = atom<boolean>({
	key: 'nodes-visible',
	default: true,
})

export function useNodesVisible() {
	return useRecoilValue(nodesVisibleState)
}

export function useSetNodesVisible() {
	return useSetRecoilState(nodesVisibleState)
}

export const edgesVisibleState = atom<boolean>({
	key: 'edges-visible',
	default: true,
})

export function useEdgesVisible() {
	return useRecoilValue(edgesVisibleState)
}

export function useSetEdgesVisible() {
	return useSetRecoilState(edgesVisibleState)
}

export function useGraphViewType() {
	return useRecoilValue(constrainedGraphViewState)
}

export function useSetGraphViewType() {
	return useSetRecoilState(graphViewState)
}
