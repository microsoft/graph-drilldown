/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React from 'react'
import { useArqueroVisibleNodesTable } from '~/arquero'
import { ColorSelector } from '~/controls/ColorSelector'
import { useNodeColorEncoding, useUpdateNodeColorEncoding } from '~/state'

export const NodeColorControls = () => {
	const encoding = useNodeColorEncoding()
	const updateEncoding = useUpdateNodeColorEncoding()
	const table = useArqueroVisibleNodesTable()
	return (
		<ColorSelector
			table={table}
			encoding={encoding}
			onChange={updateEncoding}
		/>
	)
}
