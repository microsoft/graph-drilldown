/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CommunityCollection } from '@graph-drilldown/arquero'
import { desc } from 'arquero'
import { useCallback, useMemo } from 'react'

import { useCommunitySort } from '~/state'

export function useSortHandling(communities: CommunityCollection) {
	const [sort, setSort] = useCommunitySort()

	const sorted = useMemo(() => {
		const { descending, field } = sort
		const order = descending ? desc(field) : field
		return communities.sort(order)
	}, [communities, sort])

	const onHeaderClick = useCallback(
		column => {
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
		onHeaderClick,
	}
}
