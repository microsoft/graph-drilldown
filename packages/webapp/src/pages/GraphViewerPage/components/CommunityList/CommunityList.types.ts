/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Color } from '@thematic/color'

export enum Mark {
	None = 0,
	Circle = 1,
	Rect = 2,
}

export interface Column {
	header: string
	field?: string
	accessor?: (d: any) => number | string
	width?: number
	height?: number
	sizeScale?: (d: any) => number | undefined
	fillScale?: (d: any) => Color
	mark?: Mark
}

export interface ElementStyles {
	circle?: React.CSSProperties
	rect?: React.CSSProperties
	none?: React.CSSProperties
}

export interface CommunityRowStyles {
	tableRow?: React.CSSProperties
	tableElements?: ElementStyles
}

export interface TableRowStyles {
	selected?: boolean
}
