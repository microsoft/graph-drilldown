/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'
import {
	atom,
	atomFamily,
	selectorFamily,
	useRecoilValue,
	useSetRecoilState,
} from 'recoil'

import { getColumnStats } from '@graph-drilldown/arquero'

import type { NumericEncoding } from '../../types'
import type { ColumnStats } from '@graph-drilldown/types'
import { selectedCommunityState } from '../communities'
import { communityNodesTableState } from '../tables'
import { getDefaultNumericOptions } from './config'

const fieldState = atom<string>({
	key: 'node-opacity-encoding-field',
	default: '',
})

const encodingState = atomFamily<NumericEncoding, string>({
	key: 'node-opacity-encoding-state',
	default: selectorFamily<NumericEncoding, string>({
		key: 'node-opacity-encoding-state-default',
		get:
			(field: string) =>
			({ get }) => {
				const pid = get(selectedCommunityState)
				const table = get(communityNodesTableState(pid))
				const stats = getColumnStats(table, field)
				return getDefaultNodeOpacityOptions(field, stats)
			},
	}),
})

export function useNodeOpacityEncoding() {
	const field = useRecoilValue(fieldState)
	return useRecoilValue(encodingState(field))
}

export function useUpdateNodeOpacityEncoding() {
	const encoding = useNodeOpacityEncoding()
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

function getDefaultNodeOpacityOptions(
	field: string,
	stats: ColumnStats,
): NumericEncoding {
	return getDefaultNumericOptions(field, stats, {
		value: 0.9,
		range: [0.1, 1],
	})
}
