/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

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
	table: ColumnTable
	// NOTE: these are the supported types of aggregation
	// however, there is no reason this can't allow completely arbitrary "types"
	type: ItemType
}

export interface ColumnDef {
	name: string
	type: ItemType
	dataType: string
	readOnly?: boolean
}

export interface ColumnStats {
	dataType?: string
	precision: number
	unique: string[] | number[]
	domain: [number, number]
	domain95: [number, number]
	domain99: [number, number]
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
	table?: ColumnTable
	rows?: number
	cols?: number
}
