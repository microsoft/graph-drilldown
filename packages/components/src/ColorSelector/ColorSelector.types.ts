/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ColorEncoding } from '@graph-drilldown/types'
import type ColumnTable from 'arquero/dist/types/table/column-table'

export interface ColorSelectorProps {
	/**
	 * table the encoding will be binding to, so we can lookup stats
	 * or column names as needed
	 */
	table: ColumnTable
	encoding: ColorEncoding
	onChange: (encoding: Partial<ColorEncoding>) => void
}
