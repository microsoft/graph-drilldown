/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ColorEncoding } from '../../types'
import { VerticalNominalChips } from './VerticalNominalChips'
import { useDimensions } from '@essex-js-toolkit/hooks'
import { Label } from '@fluentui/react'
import { useRef } from 'react'
import styled from 'styled-components'

const ITEM_HEIGHT = 16
const MAX_ITEMS = 5

export interface NominalLegendProps {
	encoding: ColorEncoding
}

export const NominalLegend: React.FC<NominalLegendProps> = ({ encoding }) => {
	const ref = useRef(null)
	const dimensions = useDimensions(ref)
	return (
		<Container ref={ref}>
			<Label>Legend</Label>
			<VerticalNominalChips
				encoding={encoding}
				width={dimensions?.width}
				height={ITEM_HEIGHT}
				maxItems={MAX_ITEMS}
			/>
		</Container>
	)
}

const Container = styled.div``
