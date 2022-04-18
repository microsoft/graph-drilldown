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

import { selectedCommunityState } from '../communities'
import { themeState } from '../settings'
import { communityNodesTableState } from '../tables'
import { getDefaultColorOptions } from './config'

const fieldState = atom<string>({
	key: 'node-color-encoding-field',
	default: 'community.id',
})

const encodingState = atomFamily<ColorEncoding, string>({
	key: 'node-color-encoding-state',
	default: selectorFamily<ColorEncoding, string>({
		key: 'node-color-encoding-state-default',
		get:
			(field: string) =>
			({ get }) => {
				const pid = get(selectedCommunityState)
				const table = get(communityNodesTableState(pid))
				const stats = getColumnStats(table, field)
				const theme = get(themeState)
				return getDefaultNodeColorOptions(field, stats, theme)
			},
	}),
})

export function useNodeColorEncoding() {
	const field = useRecoilValue(fieldState)
	return useRecoilValue(encodingState(field))
}

export function useUpdateNodeColorEncoding() {
	const encoding = useNodeColorEncoding()
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

function getDefaultNodeColorOptions(
	field: string,
	stats: ColumnStats,
	theme: Theme,
): ColorEncoding {
	return getDefaultColorOptions(field, stats, {
		value: theme.node().fill().hex(),
		thematicSchemePath: 'nominal[0]',
	})
}
