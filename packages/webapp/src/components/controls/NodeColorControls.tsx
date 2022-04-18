/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ColorSelector } from '@graph-drilldown/components'

import { useArqueroVisibleNodesTable } from '~/arquero'
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
