/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ScaleType } from '@thematic/core'


export interface NavTreeArray {
	id: string
	size: number
}



export interface Bounds {
	x: {
		min: number
		max: number
	}
	y: {
		min: number
		max: number
	}
}

export interface Breadcrumb {
	key: string
	text: string
}

export enum ViewType {
	SingleGraph,
	SmallMultiple,
}

export enum BrowserOptions {
	Browser = 'browser',
	Table = 'table',
}

/**
 * Indicates how a column's visual config is data-bound
 */
export enum DataBinding {
	/**
	 * No data binding, uses a fixed value
	 */
	Fixed = 'fixed',
	/**
	 * Bound to a palette value, e.g., thematic colors
	 */
	Palette = 'palette',
	/**
	 * Bound to a variable scale
	 */
	Scaled = 'scaled',
}

export interface Encoding {
	binding: DataBinding
	/**
	 * Data field (column) to bind to
	 */
	field?: string
	/**
	 * Data type of the column
	 * Used for selecting default scale types
	 */
	dataType?: string
	/**
	 * Scale type to map values (only required for numeric scales)
	 */
	scaleType?: ScaleType
	/**
	 * Data domain for the bound column
	 */
	domain?: [number, number]
	/**
	 * Output data range (units mapped to encoding: e.g., pixels)
	 */
	range?: [number, number]
}

export interface ColorEncoding extends Encoding {
	/**
	 * Fixed color CSS value
	 */
	value?: string
	/**
	 * Path of the color on theme.scheme.
	 * Includes support for indexed palettes, e.g., 'nominal[1]'.
	 * This is very rudimentary, but allows us to recompute the
	 * color if the theme changes.
	 */
	thematicSchemePath?: string
	/**
	 * Named thematic scale to use for the color
	 * nominal, sequential, diverging, etc.
	 */
	scaleName?: string
	/**
	 * For nominal scales, this is the list of unique values.
	 */
	uniques?: string[] | number[]
}

export interface NumericEncoding extends Encoding {
	/**
	 * Fixed numeric value
	 */
	value?: number
}

export interface Sort {
	field: string
	descending?: boolean
}
