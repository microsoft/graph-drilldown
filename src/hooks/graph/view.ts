/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ROOT_COMMUNITY_ID } from '../../constants'
import { ViewType } from '../../types'
import { Bounds } from '@graspologic/renderer'
import { useMemo } from 'react'
import {
	useFeatures,
	useGraphViewType,
	useNodeStatsByCommunity,
	useSelectedCommunity,
} from '~/state'

export function useDataBounds() {
	const pid = useSelectedCommunity()
	const stats = useNodeStatsByCommunity(pid, 0.99)
	return useMemo(() => {
		// for root zoom level, we  want max bounds
		// otherwise we want to zoom in a little bit to ignore far-flung outliers
		if (pid === ROOT_COMMUNITY_ID) {
			return {
				x: {
					min: 0,
					max: 1,
				},
				y: {
					min: 0,
					max: 1,
				},
			}
		}
		return {
			x: {
				min: stats.minX,
				max: stats.maxX,
			},
			y: {
				min: stats.minY,
				max: stats.maxY,
			},
		}
	}, [pid, stats])
}

export function useCameraBounds(bounds?: Bounds) {
	const view = useGraphViewType()
	const [features] = useFeatures()
	return useMemo(() => {
		if (view === ViewType.SingleGraph && features.enableZoomToCommunity) {
			return bounds
		}
		return undefined
	}, [bounds, view, features])
}

/**
 * Uses the current databounds plus view type to determine
 * a dynamic set of camera bounds (zoomed in or not).
 */
export function useDynamicCameraBounds() {
	const dataBounds = useDataBounds()
	return useCameraBounds(dataBounds)
}
