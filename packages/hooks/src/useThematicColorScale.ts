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
import { chooseScale } from '@thematic/core'

export function useThematicColorScale(
	encoding: ColorEncoding,
): ContinuousColorScaleFunction | NominalColorScaleFunction {
	const theme = useThematic()
	return useMemo(() => {
		const { scaleType, domain, uniques = [] } = encoding
		// TODO: update thematic scale name to be optional since it defaults to nominal
		return chooseScale(theme, encoding.scaleName || 'nominal', uniques.length, domain, scaleType)
	}, [theme, encoding])
}
