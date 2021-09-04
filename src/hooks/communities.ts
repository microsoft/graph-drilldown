/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'
import { CommunityCollection, getColumnStats } from '~/arquero'

export function useNodeCountDomain(
	communities: CommunityCollection,
): [number, number] {
	return useCommunityValueDomain(communities, 'community.nodeCount')
}

export function useChildCountDomain(
	communities: CommunityCollection,
): [number, number] {
	return useCommunityValueDomain(communities, 'community.childCount')
}

export function useCommunityValueDomain(
	communities: CommunityCollection,
	field: string,
): [number, number] {
	return useMemo(
		() => getColumnStats(communities.table, field).domain,
		[communities, field],
	)
}
