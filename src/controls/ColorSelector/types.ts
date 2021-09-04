/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ColorEncoding } from '../../types'
import { table } from 'arquero'

export interface ColorSelectorProps {
	/**
	 * table the encoding will be binding to, so we can lookup stats
	 * or column names as needed
	 */
	table: table
	encoding: ColorEncoding
	onChange: (encoding: Partial<ColorEncoding>) => void
}
