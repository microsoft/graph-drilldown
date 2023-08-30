/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { NumericSelector } from '@graph-drilldown/components'
import styled from 'styled-components'

import {
	useEdgeSizeEncoding,
	useEdgeTable,
	useUpdateEdgeSizeEncoding,
} from '~/state'

export const EdgeSizeControls = () => {
	const encoding = useEdgeSizeEncoding()
	const updateEncoding = useUpdateEdgeSizeEncoding()
	const table = useEdgeTable()
	return (
		<Container>
			<NumericSelector
				label='edge size'
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
