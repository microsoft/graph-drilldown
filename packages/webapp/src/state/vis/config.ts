/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ScaleType } from '@thematic/core'

import type { ColorEncoding,  NumericEncoding } from '../../types'
import type { ColumnStats } from '@graph-drilldown/types'
import { DataBinding } from '../../types'

export function getDefaultColorOptions(
	field: string,
	stats: ColumnStats,
	custom: Partial<ColorEncoding>,
): ColorEncoding {
	const { dataType, unique, domain99 } = stats
	const binding = !field ? DataBinding.Palette : DataBinding.Scaled
	return {
		binding,
		field: field,
		dataType,
		scaleType: ScaleType.Linear,
		scaleName: dataType === 'string' ? 'nominal' : 'sequential',
		uniques: unique,
		domain: domain99,
		...custom,
	}
}

export function getDefaultNumericOptions(
	field: string,
	stats: ColumnStats,
	custom: Partial<NumericEncoding>,
): NumericEncoding {
	const { dataType, domain99 } = stats || {
		domain99: [0, 1],
	}
	const binding = !field ? DataBinding.Fixed : DataBinding.Scaled
	return {
		field: field,
		binding,
		dataType,
		scaleType: ScaleType.Linear,
		value: 0,
		domain: domain99,
		range: [0, 1],
		...custom,
	}
}
