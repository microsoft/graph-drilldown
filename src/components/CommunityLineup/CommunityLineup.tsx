/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ItemMap, CommunityLineupProps } from './types'
import { ThematicLineup, ColumnConfig } from '@essex-js-toolkit/thematic-lineup'
import React, { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import './CommunityLineup.css'
import {
	TableCollection,
	useArqueroVisibleCommunities,
	useColumnArray,
} from '~/arquero'
import { Community } from '~/types'

const MIN_COLUMN_WIDTH = 100

/* Displays current Community Lineup based on current user community selection 
in Navigation Panel and uses thematic-lineup
*/
export const CommunityLineup: React.FC<CommunityLineupProps> = memo(
	function CommunityLineup({ width, height }: CommunityLineupProps) {
		const communities = useArqueroVisibleCommunities()
		const columnConfig = useColumnConfig(communities, width)

		const lineupData = useMemo((): ItemMap[] => {
			if (columnConfig.length > 0) {
				const values = communities.map(comm => {
					const item = columnConfig.reduce(
						(acc: ItemMap, column: ColumnConfig) => {
							acc[column.name] = comm.get(column.name)
							return acc
						},
						{} as ItemMap,
					)
					return item
				})
				return values
			}
			return []
		}, [columnConfig, communities])

		return (
			<Container width={width}>
				{lineupData.length > 0 ? (
					<ThematicLineup
						histograms
						data={lineupData}
						columns={columnConfig}
						width={width}
						height={height}
						// TODO: this should use the column ID, not the label. is this a lineup bug?
						defaultSortColumn={'Node count'}
						defaultSortAscending={false}
					/>
				) : (
					<></>
				)}
			</Container>
		)
	},
)

const Container = styled.div<{ width: number }>`
	max-width: ${({ width }) => width};
`

function label(col: string) {
	const value = col.split('.')[1]
	const spaced = value.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
	return spaced.substr(0, 1).toUpperCase() + spaced.substr(1).toLowerCase()
}

// sorts the columns to make sure the first three match the drilldown, and the rest are alpha
function sortColumns(columns: string[]) {
	const defs = {
		'community.id': true,
		'community.nodeCount': true,
		'community.childCount': true,
	}
	const alpha = [...columns.sort()].filter(s => !defs[s])
	return [...Object.keys(defs), ...alpha]
}

function useColumnConfig(
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
	const getTypeOf = useCallback(
		(columnName: string) => typeof communities.table.get(columnName, 0),
		[communities],
	)
	const configs = useMemo((): ColumnConfig[] => {
		if (columns.length > 0) {
			// extra 20px from lineup for selection column, and 5px per for right margin of all
			const widthPerColumn = (width - 25 - columns.length * 5) / columns.length
			return columns.map((column, i) => {
				const columnName = label(column)
				return {
					name: column,
					label: columnName,
					type: getTypeOf(column),
					width:
						widthPerColumn > MIN_COLUMN_WIDTH
							? widthPerColumn
							: MIN_COLUMN_WIDTH,
					frozen: true,
				}
			})
		}
		return []
	}, [columns, width, getTypeOf])
	return configs
}
