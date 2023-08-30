/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { NumericSelector } from '@graph-drilldown/components'
import styled from 'styled-components'

import {
	useEdgeOpacityEncoding,
	useEdgeTable,
	useUpdateEdgeOpacityEncoding,
} from '~/state'

export const EdgeOpacityControls = () => {
	const encoding = useEdgeOpacityEncoding()
	const updateEncoding = useUpdateEdgeOpacityEncoding()
	const table = useEdgeTable()
	return (
		<Container>
			<NumericSelector
				label='edge opacity'
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
