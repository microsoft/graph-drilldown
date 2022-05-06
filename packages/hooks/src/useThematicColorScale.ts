/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ColorEncoding } from '@graph-drilldown/types'
import type {
	ContinuousColorScaleFunction,
	NominalColorScaleFunction,
} from '@thematic/core'
import { useThematic } from '@thematic/react'
import { useMemo } from 'react'

export function useThematicColorScale(
	encoding: ColorEncoding,
): ContinuousColorScaleFunction | NominalColorScaleFunction {
	const theme = useThematic()
	return useMemo(() => {
		const scales = theme.scales()
		const { scaleType, domain, uniques = [] } = encoding
		switch (encoding.scaleName) {
			case 'nominalMuted':
				return scales.nominalMuted(uniques.length)
			case 'nominalBold':
				return scales.nominalBold(uniques.length)
			case 'sequential':
				return scales.sequential(domain, scaleType)
			case 'sequential2':
				return scales.sequential2(domain, scaleType)
			case 'diverging':
				return scales.diverging(domain, scaleType)
			case 'diverging2':
				return scales.diverging2(domain, scaleType)
			case 'greys':
				return scales.greys(domain, scaleType)
			default:
				return scales.nominal(uniques.length)
		}
	}, [theme, encoding])
}
