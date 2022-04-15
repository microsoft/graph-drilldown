/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import type { NumericEncoding } from '../../types'

export interface NumericSelectorProps {
	/**
	 * table the encoding will be binding to, so we can lookup stats
	 * or column names as needed
	 */
	table: ColumnTable
	encoding: NumericEncoding
	onChange: (encoding: Partial<NumericEncoding>) => void
	label?: string
	// optional slider props for fixed selector
	min?: number
	max?: number
	step?: number
}
