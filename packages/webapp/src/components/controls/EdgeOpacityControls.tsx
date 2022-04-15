/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import styled from 'styled-components'

import { useArqueroEdgeTable } from '~/arquero'
import { NumericSelector } from '~/controls/NumericSelector'
import { useEdgeOpacityEncoding, useUpdateEdgeOpacityEncoding } from '~/state'

export const EdgeOpacityControls = () => {
	const encoding = useEdgeOpacityEncoding()
	const updateEncoding = useUpdateEdgeOpacityEncoding()
	const table = useArqueroEdgeTable()
	return (
		<Container>
			<NumericSelector
				label="edge opacity"
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
