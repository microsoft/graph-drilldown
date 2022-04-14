/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { desc } from 'arquero'
import { useMemo } from 'react'
import { TableCollection, useColumnArray } from '~/arquero'
import { Community } from '~/types'

const MIN_COLUMN_WIDTH = 100

export function useColumnConfig(
	communities: TableCollection<Community>,
	width: number,
) {
	const columnList = useColumnArray(communities, ['community'], [])
	const columns: string[] = useMemo(() => {
		if (columnList.length > 0) {
			return sortColumns(columnList)
		}
		return []
	}, [columnList])
	return useMemo(() => {
		const w = width / columns.length - 20 // padding
		const mw = w < MIN_COLUMN_WIDTH ? MIN_COLUMN_WIDTH : w
		return columns.map(name => ({
			key: name,
			name,
			fieldName: name,
			width: mw,
			minWidth: mw,
		}))
	}, [columns, width])
}

export function useDefaultSortedTable(communities: TableCollection<Community>) {
	return useMemo(() => {
		const { table } = communities
		return table.numCols() > 0
			? table?.orderby(desc('community.nodeCount'))
			: table
	}, [communities])
}

// TODO: we want to use this, but DWC table doesn't currently support labels named differently than the column key
// function label(col: string) {
// 	const value = col.split('.')[1]
// 	const spaced = value.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
// 	return spaced.substr(0, 1).toUpperCase() + spaced.substr(1).toLowerCase()
// }

// sorts the column order to make sure the first three match the drilldown, and the rest are alpha
function sortColumns(columns: string[]) {
	const defs = {
		'community.id': true,
		'community.nodeCount': true,
		'community.childCount': true,
	}
	const alpha = [...columns.sort()].filter(s => !defs[s])
	return [...Object.keys(defs), ...alpha]
}
