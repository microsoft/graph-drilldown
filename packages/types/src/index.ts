/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export * from './data.js'
export * from './vis.js'

export interface Sort {
	field: string
	descending?: boolean
}
