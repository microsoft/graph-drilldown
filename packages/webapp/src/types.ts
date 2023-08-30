/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

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
	SingleGraph = 0,
	SmallMultiple = 1,
}

export enum BrowserOptions {
	Browser = 'browser',
	Table = 'table',
}
