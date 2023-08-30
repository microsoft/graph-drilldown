/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Label } from '@fluentui/react'
import type { Encoding } from '@graph-drilldown/types'
import { format } from 'd3-format'
import { useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { DomainBrush } from '../DomainBrush/index.js'

export interface NumericRangeEditorProps {
	encoding: Encoding
	onChange: (encoding: Partial<Encoding>) => void
	min?: number
	max?: number
	precision?: number
}

export const NumericRangeEditor: React.FC<NumericRangeEditorProps> = ({
	encoding,
	onChange,
	min = 0,
	max = 1,
	precision = 1,
}) => {
	const handleRangeChange = useCallback(
		(d) => {
			onChange?.({
				range: d,
			})
		},
		[onChange],
	)

	const fmt = useMemo(() => format(`.${precision}f`), [precision])

	return (
		<Container>
			<Label>{`Output range (${fmt(min)} - ${fmt(max)})`}</Label>
			<DomainBrush
				min={min}
				max={max}
				precision={precision}
				currentDomain={encoding.range}
				onChange={handleRangeChange}
				showTextInputs
			/>
		</Container>
	)
}

const Container = styled.div``
