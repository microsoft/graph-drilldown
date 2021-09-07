/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import styled from 'styled-components'
import { useArqueroVisibleNodesTable } from '~/arquero'
import { NumericSelector } from '~/controls/NumericSelector'
import { useNodeSizeEncoding, useUpdateNodeSizeEncoding } from '~/state'

export const NodeSizeControls = () => {
	const encoding = useNodeSizeEncoding()
	const updateEncoding = useUpdateNodeSizeEncoding()
	const table = useArqueroVisibleNodesTable()
	return (
		<Container>
			<NumericSelector
				label="node size"
				table={table}
				encoding={encoding}
				onChange={updateEncoding}
				min={0.5}
				max={50}
				step={0.5}
			/>
		</Container>
	)
}

const Container = styled.div``
