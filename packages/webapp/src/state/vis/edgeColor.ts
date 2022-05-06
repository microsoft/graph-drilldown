/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { getColumnStats } from '@graph-drilldown/arquero'
import type { ColorEncoding, ColumnStats } from '@graph-drilldown/types'
import type { Theme } from '@thematic/core'
import { useCallback } from 'react'
import {
	atom,
	atomFamily,
	selectorFamily,
	useRecoilValue,
	useSetRecoilState,
} from 'recoil'

import { themeState } from '../settings'
import { edgeTableState } from '../tables'
import { getDefaultColorOptions } from './config'

const fieldState = atom<string>({
	key: 'edge-color-encoding-field',
	default: '',
})

const encodingState = atomFamily<ColorEncoding, string>({
	key: 'edge-color-encoding-state',
	default: selectorFamily<ColorEncoding, string>({
		key: 'edge-color-encoding-state-default',
		get:
			(field: string) =>
			({ get }) => {
				const theme = get(themeState)
				const table = get(edgeTableState)
				const stats = getColumnStats(table, field)
				return getDefaultEdgeColorOptions(stats, theme, field)
			},
	}),
})

export function useEdgeColorEncoding() {
	const field = useRecoilValue(fieldState)
	return useRecoilValue(encodingState(field))
}

export function useUpdateEdgeColorEncoding() {
	const encoding = useEdgeColorEncoding()
	const setter = useSetRecoilState(encodingState(encoding.field || ''))
	const fieldSetter = useSetRecoilState(fieldState)
	return useCallback(
		(update: Partial<ColorEncoding>) => {
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

function getDefaultEdgeColorOptions(
	stats: ColumnStats,
	theme: Theme,
	field?: string,
): ColorEncoding {
	return getDefaultColorOptions(field || '', stats, {
		value: theme.link().stroke().hex(),
		thematicSchemePath: 'highContrastAnnotation',
	})
}
