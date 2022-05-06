/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { listColumnDefinitions } from '@graph-drilldown/arquero'
import type { ColumnDefinition } from '@graph-drilldown/types'
import { not } from 'arquero'
import { useCallback, useMemo } from 'react'

import { useBigTable, useBrowserColumns, useSetBigTable } from '~/state'

const fixed = new Set([
	'node.id',
	'node.x',
	'node.y',
	'node.d',
	'community.id',
	'community.pid',
	'community.childCount',
	'community.nodeCount',
])

/**
 * This is the list of columns for the main table,
 * and includes the ability to delete them directly.
 */
export function useColumns() {
	const bigTable = useBigTable()
	const setBigTable = useSetBigTable()

	const columns = useMemo(
		() => listColumnDefinitions(bigTable, fixed),
		[bigTable],
	)

	const doRemoveColumn = useCallback(
		(column: ColumnDefinition) => {
			// TODO: we could inadvertently use this to remove required columns, such as node.id which should be blocked
			// TODO: if a removed column is the current visual encoding, it will error - find a fallback
			const derived = bigTable.select(not(column.name))
			derived.print()
			setBigTable(derived)
		},
		[bigTable, setBigTable],
	)

	const [browserColumns, setBrowserColumns] = useBrowserColumns()
	const onVisibilityChange = useCallback(
		(updated: ColumnDefinition, prevState: boolean) => {
			const name = updated.name
			const state = !prevState
			const copy = new Set(browserColumns)
			if (!state) {
				copy.delete(name)
			} else {
				copy.add(name)
			}
			setBrowserColumns(copy)
		},
		[setBrowserColumns, browserColumns],
	)

	const getIsVisible = useCallback(
		(column: ColumnDefinition) => {
			if (browserColumns.size > 0) {
				return browserColumns.has(column.name)
			}
			return false
		},
		[browserColumns],
	)

	return {
		columns,
		doRemoveColumn,
		onVisibilityChange,
		getIsVisible,
	}
}
