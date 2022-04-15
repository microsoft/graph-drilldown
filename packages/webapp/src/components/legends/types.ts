/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ColorEncoding, NumericEncoding } from '../../types'

export interface LegendProps {
	width?: number
	height?: number
	maxItems?: number
}

export interface ColorLegendProps extends LegendProps {
	encoding: ColorEncoding
}

export interface SizeLegendProps extends LegendProps {
	encoding: NumericEncoding
}

export interface OpacityLegendProps extends LegendProps {
	encoding: NumericEncoding
}
