/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useSliderProps } from '@essex/components'
import { Slider } from '@fluentui/react'
import { useDebounceFn } from 'ahooks'
import { useState } from 'react'
import styled from 'styled-components'

import type { NumericSelectorProps } from './NumericSelector.types.js'
export const FixedPicker: React.FC<NumericSelectorProps> = ({
	encoding,
	onChange,
	label,
	min,
	max,
	step,
}) => {
	const [rangeValue, setRangeValue] = useState(encoding.value)

	const useDebounce = useDebounceFn(
		value => {
			onChange({ value })
		},
		{
			wait: 300,
		},
	)

	const sliderProps = useSliderProps(sliderBase, 'small')
	return (
		<Container>
			<Controls>
				<Slider
					label={label}
					min={min}
					max={max}
					step={step}
					value={rangeValue}
					onChange={(value: number) => {
						useDebounce.run(value)
						setRangeValue(value)
					}}
					{...sliderProps}
				/>
			</Controls>
		</Container>
	)
}

const Container = styled.div`
	margin-top: 8px;
`

const Controls = styled.div``

const sliderBase = {
	styles: {
		valueLabel: {
			width: 20,
		},
	},
}
