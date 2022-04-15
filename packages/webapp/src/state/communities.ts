/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	atom,
	useRecoilState,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

import { ROOT_COMMUNITY_ID } from '../constants'
import type { Sort } from '../types'

const communitySort = atom<Sort>({
	key: 'community-sort',
	default: {
		field: 'community.nodeCount',
		descending: true,
	},
})

const navigationalState = atom<string[]>({
	key: 'navigationalState',
	default: [ROOT_COMMUNITY_ID],
})

const hoveredCommunityState = atom<string | undefined>({
	key: 'hovered-community',
	default: undefined,
})

export const selectedCommunityState = atom<string>({
	key: 'selected-community',
	default: ROOT_COMMUNITY_ID,
})

export function useHoveredCommunity() {
	return useRecoilValue(hoveredCommunityState)
}

export function useSetHoveredCommunity() {
	return useSetRecoilState(hoveredCommunityState)
}

export function useSelectedCommunity() {
	return useRecoilValue(selectedCommunityState)
}

export function useSetSelectedCommunity() {
	return useSetRecoilState(selectedCommunityState)
}

export function useResetSelectedCommunity() {
	return useResetRecoilState(selectedCommunityState)
}

export function useSetNavigationState() {
	return useSetRecoilState(navigationalState)
}
export function useNavigationState() {
	return useRecoilValue(navigationalState)
}

export function useResetNavigationState() {
	return useResetRecoilState(navigationalState)
}

export function useCommunitySort() {
	return useRecoilState(communitySort)
}
