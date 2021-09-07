/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import styled from 'styled-components'
import { useArqueroEdgeTable } from '~/arquero'
import { ColorSelector } from '~/controls/ColorSelector/ColorSelector'
import { useEdgeColorEncoding, useUpdateEdgeColorEncoding } from '~/state'

export const EdgeColorControls = () => {
	const encoding = useEdgeColorEncoding()
	const updateEncoding = useUpdateEdgeColorEncoding()
	const table = useArqueroEdgeTable()
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
