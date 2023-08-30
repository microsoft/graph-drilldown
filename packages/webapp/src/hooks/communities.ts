/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { CommunityCollection, getColumnStats } from '@graph-drilldown/arquero'
import { desc, table } from 'arquero'
import { useCallback, useMemo } from 'react'

import {
	useCommunitiesTable,
	useCommunitySort,
	useSelectedCommunity,
} from '~/state'

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

export function useSortHandling(communities: CommunityCollection) {
	const [sort, setSort] = useCommunitySort()

	const sorted = useMemo(() => {
		const { descending, field } = sort
		const order = descending ? desc(field) : field
		return communities.sort(order)
	}, [communities, sort])

	const onSortClick = useCallback(
		(column) => {
			if (sort.field === column.field) {
				setSort({
					...sort,
					descending: !sort.descending,
				})
			} else {
				setSort({
					...sort,
					field: column.field,
				})
			}
		},
		[sort, setSort],
	)

	return {
		sort,
		sorted,
		onSortClick,
	}
}

// visible communities are always derived from the selected parent
export function useVisibleCommunities() {
	const pid = useSelectedCommunity()
	const communities = useCommunitiesTable()
	const tbl = useMemo(() => {
		if (communities.numCols() > 0 && pid) {
			const filtered = communities
				.params({
					pid,
				})
				.filter((d: any, $: any) => d['community.pid'] === $.pid)
				.ungroup()
			return filtered
		}
		return table({})
	}, [pid, communities])
	return useMemo(() => new CommunityCollection(tbl), [tbl])
}
