/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React from 'react'
import styled from 'styled-components'
import { useArqueroVisibleNodesTable } from '~/arquero'
import { NumericSelector } from '~/controls/NumericSelector'
import { useNodeOpacityEncoding, useUpdateNodeOpacityEncoding } from '~/state'

export const NodeOpacityControls = () => {
	const encoding = useNodeOpacityEncoding()
	const updateEncoding = useUpdateNodeOpacityEncoding()
	const table = useArqueroVisibleNodesTable()
	return (
		<Container>
			<NumericSelector
				label="node opacity"
				table={table}
				encoding={encoding}
				onChange={updateEncoding}
				min={0}
				max={1}
				step={0.1}
			/>
		</Container>
	)
}

const Container = styled.div``
