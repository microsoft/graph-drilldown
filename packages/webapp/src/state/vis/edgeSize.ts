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

import { getColumnStats } from '~/arquero'

import type { ColumnStats, NumericEncoding } from '../../types'
import { edgeTableState } from '../tables'
import { getDefaultNumericOptions } from './config'

const fieldState = atom<string>({
	key: 'edge-size-encoding-field',
	default: '',
})

const encodingState = atomFamily<NumericEncoding, string>({
	key: 'edge-size-encoding-state',
	default: selectorFamily<NumericEncoding, string>({
		key: 'edge-size-encoding-state-default',
		get:
			(field: string) =>
			({ get }) => {
				// TODO: filter by parent
				const table = get(edgeTableState)
				const stats = getColumnStats(table, field)
				return getDefaultEdgeSizeOptions(field, stats)
			},
	}),
})

export function useEdgeSizeEncoding() {
	const field = useRecoilValue(fieldState)
	return useRecoilValue(encodingState(field))
}

export function useUpdateEdgeSizeEncoding() {
	const encoding = useEdgeSizeEncoding()
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

function getDefaultEdgeSizeOptions(
	field: string,
	stats: ColumnStats,
): NumericEncoding {
	return getDefaultNumericOptions(field, stats, {
		value: 4,
		range: [1, 10],
	})
}
