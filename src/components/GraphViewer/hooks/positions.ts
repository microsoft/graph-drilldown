/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PositionMap } from '@graspologic/graph'
import { useMemo } from 'react'
import { useStandardNodePositions, useGriddedNodePositions } from '~/arquero'
import { ViewType } from '~/types'

// creates two sets of positions for the nodes
// 1: their default layout
// 2: a gridded community small multiples layout
export function usePositions(view: ViewType): [PositionMap, PositionMap] {
	const defaultPositionMap = useStandardNodePositions()
	const griddedPositionMap = useGriddedNodePositions(
		view === ViewType.SmallMultiple,
	)
	return useMemo(
		() => [defaultPositionMap, griddedPositionMap],
		[defaultPositionMap, griddedPositionMap],
	)
}
