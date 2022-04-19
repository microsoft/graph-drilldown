/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ColorSelector } from '@graph-drilldown/components'
import styled from 'styled-components'

import {
	useEdgeColorEncoding,
	useEdgeTable,
	useUpdateEdgeColorEncoding,
} from '~/state'

export const EdgeColorControls = () => {
	const encoding = useEdgeColorEncoding()
	const updateEncoding = useUpdateEdgeColorEncoding()
	const table = useEdgeTable()
	return (
		<Container>
			<ColorSelector
				table={table}
				encoding={encoding}
				onChange={updateEncoding}
			/>
		</Container>
	)
}

const Container = styled.div``
