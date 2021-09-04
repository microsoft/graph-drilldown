/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ScaleType } from '@thematic/core'
import { table } from 'arquero'

export interface TableBackedItem {
	id: string
	get: (column: string) => any
	columns: string[]
}
export interface Node extends TableBackedItem {
	x: number
	y: number
	d?: number
}
interface NodeAttrs {
	[key: string]: boolean | number | string | undefined
}
export interface NodeValues {
	id: string
	attrs: NodeAttrs
}

export interface NavTreeArray {
	id: string
	size: number
}

export interface Community extends TableBackedItem {
	pid: string
	childCount: number
	nodeCount: number
}

export interface Edge extends TableBackedItem {
	source: string
	target: string
	weight?: number
}

export type ItemType = 'node' | 'community' | 'edge' | 'join'

export interface TableDef {
	table: table
	// NOTE: these are the supported types of aggregation
	// however, there is no reason this can't allow completely arbitrary "types"
	type: ItemType
}

export enum FileOrigin {
	/**
	 * Local file uploaded directly from the user, e.g., via drag/drop
	 */
	Local = 'local',
	/**
	 * Baked in preset file, published in /public/data
	 */
	Preset = 'preset',
	/**
	 * Remote url file, such as pipeline outputs
	 */
	Remote = 'remote',
}

/**
 * Represents a physical file or remote dataset that has been loaded.
 * This allows us to keep track of and represent to the user any data
 * loaded into the system.
 * For example, if they drag/drop a file, this will hold a copy of the raw
 * original table, even if the app uses derived copies.
 */
export interface DataFile {
	/**
	 * Optional name that the user or system can provide
	 */
	name?: string
	url: string
	origin: FileOrigin
	/**
	 * If the user has indicated whether this is nodes, edges, etc.
	 */
	tableType?: ItemType
	table?: table
	rows?: number
}

export interface ColumnDef {
	name: string
	type: ItemType
	dataType: string
	readOnly?: boolean
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

export interface ColumnStats {
	dataType?: string
	precision: number
	unique: string[] | number[]
	domain: [number, number]
	domain95: [number, number]
	domain99: [number, number]
}

export enum BrowserOptions {
	Browser = 'browser',
	Lineup = 'lineup',
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
