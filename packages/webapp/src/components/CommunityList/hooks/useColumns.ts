/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'

import type { CommunityCollection } from '@graph-drilldown/arquero'
import { useChildCountDomain, useNodeCountDomain } from '~/hooks/communities'
import { useNodeColorEncoding } from '~/state'
import type { Community } from '@graph-drilldown/types'

import { BAR_HEIGHT, BAR_WIDTH } from '../CommunityList.styles'
import type { Column } from '../CommunityList.types'
import { Mark } from '../CommunityList.types'
import { useBarFillScale } from './theme'
import { useBarScale } from './useBarScale'
import { useDynamicColumn } from './useDynamicColumn'

const SLIM_BAR = 40

export function useColumns(
	communities: CommunityCollection,
	width?: number,
	height?: number,
): Column[] {
	const childCountDomain = useChildCountDomain(communities)
	const childBarScale = useBarScale(childCountDomain, [0, BAR_WIDTH])
	const nodeCountDomain = useNodeCountDomain(communities)
	const nodeBarScale = useBarScale(nodeCountDomain, [0, BAR_WIDTH])
	const encoding = useNodeColorEncoding()
	const barHeight = useMemo(
		() => (height !== undefined ? height : BAR_HEIGHT),
		[height],
	)
	const barWidth = useMemo(
		() => (width !== undefined ? width : BAR_WIDTH),
		[width],
	)

	const slimBarWidth = useMemo(
		() => (width !== undefined ? width : SLIM_BAR),
		[width],
	)

	const dynamicColumn = useDynamicColumn(encoding, slimBarWidth)
	const barFillScale = useBarFillScale()

	const columns = useMemo(() => {
		return [
			dynamicColumn,
			{
				header: 'ID',
				field: 'community.id',
				accessor: (d: Community) => d.id,
				width: slimBarWidth,
				height: barHeight,
			},
			{
				header: 'Node count',
				field: 'community.nodeCount',
				accessor: (d: Community) => d.nodeCount,
				mark: Mark.Rect,
				sizeScale: nodeBarScale,
				fillScale: barFillScale,
				width: barWidth,
				height: barHeight,
			},
			{
				header: 'Child count',
				field: 'community.childCount',
				accessor: (d: Community) => d.childCount,
				mark: Mark.Rect,
				sizeScale: childBarScale,
				fillScale: barFillScale,
				width: barWidth,
				height: barHeight,
			},
		]
	}, [
		dynamicColumn,
		nodeBarScale,
		barFillScale,
		childBarScale,
		barWidth,
		slimBarWidth,
		barHeight,
	])
	return columns
}
