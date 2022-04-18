/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { getColumnStats } from '@graph-drilldown/arquero'
import type { ColumnStats } from '@graph-drilldown/types'
import { useCallback } from 'react'
import {
	atom,
	atomFamily,
	selectorFamily,
	useRecoilValue,
	useSetRecoilState,
} from 'recoil'

import { ROOT_COMMUNITY_ID } from '../../constants'
import type { NumericEncoding } from '../../types'
import { communityNodesTableState } from '../tables'
import { getDefaultNumericOptions } from './config'

export const fieldState = atom<string>({
	key: 'node-size-encoding-field',
	default: 'node.d',
})

const encodingState = atomFamily<NumericEncoding, string>({
	key: 'node-size-encoding-state',
	default: selectorFamily<NumericEncoding, string>({
		key: 'node-size-encoding-state-default',
		get:
			(field: string) =>
			({ get }) => {
				// always use the root for size, which has the unique node list
				const pid = ROOT_COMMUNITY_ID
				const table = get(communityNodesTableState(pid))
				const stats = getColumnStats(table, field)
				return getDefaultNodeSizeOptions(field, stats)
			},
	}),
})

export function useNodeSizeEncoding() {
	const field = useRecoilValue(fieldState)
	return useRecoilValue(encodingState(field))
}

export function useUpdateNodeSizeEncoding() {
	const encoding = useNodeSizeEncoding()
	const setter = useSetRecoilState(encodingState(encoding.field || ''))
	const fieldSetter = useSetRecoilState(fieldState)
	return useCallback(
		(update: Partial<NumericEncoding>) => {
			if (update.field) {
				fieldSetter(update.field)
			} else {
				setter({
					...encoding,
					...update,
				})
			}
		},
		[encoding, setter, fieldSetter],
	)
}

function getDefaultNodeSizeOptions(
	field: string,
	stats: ColumnStats,
): NumericEncoding {
	// TODO: most fields use the 99th quantile, but node.d/size is
	// very particular from our data science team, and represents
	// a specific range in order for no-overlap layouts to look correct
	// maybe we can do a domain check and use a special case for these?
	return getDefaultNumericOptions(field, stats, {
		value: 4,
		domain: stats.domain,
		range: [0.5, 15],
	})
}
