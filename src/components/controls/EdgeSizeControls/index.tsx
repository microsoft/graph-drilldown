/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import styled from 'styled-components'
import { useArqueroEdgeTable } from '~/arquero'
import { NumericSelector } from '~/controls/NumericSelector'
import { useEdgeSizeEncoding, useUpdateEdgeSizeEncoding } from '~/state'

export const EdgeSizeControls = () => {
	const encoding = useEdgeSizeEncoding()
	const updateEncoding = useUpdateEdgeSizeEncoding()
	const table = useArqueroEdgeTable()
	return (
		<Container>
			<NumericSelector
				label="edge size"
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
