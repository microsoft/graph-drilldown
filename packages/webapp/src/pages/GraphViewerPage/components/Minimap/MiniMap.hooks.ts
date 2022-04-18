/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import { useMemo } from 'react'

import type { Bounds } from '~/types'

import type { AOIBounds } from './MiniMap.types'

export function usePlotTheme(
	width: number,
	height: number,
): React.CSSProperties {
	const theme = useThematic()
	return useMemo(
		() => ({
			width,
			height,
			border: `1px solid ${theme.plotArea().stroke().hex()}`,
		}),
		[theme, width, height],
	)
}

export function useAOIBounds(
	height: number,
	width: number,
	aoiBounds?: Bounds,
): AOIBounds {
	// aoi will be tied to actual pixel dimensions, so we need to adjust the 0-1 scaling to fit
	const ab = useMemo(
		() => ({
			x: {
				min: aoiBounds ? aoiBounds.x.min * width : 0,
				max: aoiBounds ? aoiBounds.x.max * width : width,
			},
			y: {
				min: aoiBounds ? aoiBounds.y.min * height : 0,
				max: aoiBounds ? aoiBounds.y.max * height : height,
			},
		}),
		[aoiBounds, height, width],
	)
	const x = ab ? ab.x.min : 0
	const y = height - (ab ? ab.y.max : 0)
	const w = ab ? ab.x.max - ab.x.min : width
	const h = ab ? ab.y.max - ab.y.min : height
	// only show the aoi rectangle if we have valid bounds and they aren't the full extent
	const showAoi = useMemo(
		() =>
			aoiBounds && x > 0 && y > 0 && w !== width && h !== height ? true : false,
		[aoiBounds, height, x, y, h, w, width],
	)

	return { x, y, w, h, showAoi }
}
